// Тестовые данные: 14 помещений и 25 IoT-устройств (имитация датчиков)
const BUILDINGS = ["Корпус A", "Корпус B", "Корпус C", "Корпус D"];
// [id, корпус, этаж, тип, t°C, CO2, kWh, людей]
const SEED = [
  ["A-101",0,1,"Компьютерный класс",24.3,780,3.6,18],["A-102",0,1,"Лекционный зал",23.1,650,2.8,40],
  ["A-205",0,2,"Лаборатория",26.2,1620,4.1,22],["A-301",0,3,"Аудитория",22.8,540,1.9,25],
  ["B-101",1,1,"Компьютерный класс",25.0,910,3.9,20],["B-110",1,1,"Серверная",32.5,500,6.2,0],
  ["B-204",1,2,"Аудитория",23.5,720,2.2,30],["C-001",2,0,"Лекционный зал",22.0,430,5.8,0],
  ["C-105",2,1,"Лаборатория",27.4,1120,4.4,12],["C-210",2,2,"Аудитория",23.0,600,2.0,28],
  ["D-101",3,1,"Администрация",24.0,700,1.8,6],["D-102",3,1,"Библиотека",23.4,820,2.5,35],
  ["D-201",3,2,"Компьютерный класс",24.8,880,3.7,16],["D-305",3,3,"Аудитория",22.6,510,1.7,0]
];
// У этих помещений «нормальная» история отличается от текущего значения -> z-score найдёт аномалию
const HIST_BASE = { "A-205": { co2: 800 }, "B-110": { temperature: 25.5 } };
const NOISE = [-0.3, 0.2, 0, 0.3, -0.2, 0.1, -0.1, 0.2];

function nowStr() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function makeRooms() {
  return SEED.map(([id, b, floor, type, temperature, co2, energy, occupancy]) => {
    const hb = HIST_BASE[id] || {};
    const baseline = type === "Серверная" ? 5 : type === "Компьютерный класс" ? 3.5 : type === "Лаборатория" ? 3.8 : 2.2;
    return {
      id, building: BUILDINGS[b], floor, type, temperature, co2, energy, baseline, occupancy,
      history: {
        temperature: NOISE.map(n => +((hb.temperature ?? temperature) + n).toFixed(1)),
        co2: NOISE.map(n => Math.round((hb.co2 ?? co2) + n * 100))
      }
    };
  });
}
function makeDevices(rooms) {
  const list = [], t = nowStr();
  rooms.slice(0, 11).forEach(r => {
    const k = r.id.replace("-", "");
    list.push({ id: `TEMP-${k}-01`, room: r.id, type: "Temperature Sensor", status: "online", value: r.temperature, unit: "°C", updatedAt: t });
    list.push({ id: `CO2-${k}-01`, room: r.id, type: "CO2 Sensor", status: "online", value: r.co2, unit: "ppm", updatedAt: t });
  });
  [["PWR-D102-01","D-102","Power Meter",2.5,"kWh"],["ACC-D201-01","D-201","Access Control",1,"state"],["CAM-D305-01","D-305","Camera",1,"state"]]
    .forEach(([id, room, type, value, unit]) => list.push({ id, room, type, status: "online", value, unit, updatedAt: t }));
  // 3 устройства offline для демонстрации уведомлений
  ["CO2-C105-01", "TEMP-B204-01", "CAM-D305-01"].forEach(id => { const d = list.find(x => x.id === id); if (d) { d.status = "offline"; d.updatedAt = "2026-10-15 09:12"; } });
  return list;
}
const SEED_INCIDENTS = [
  { id: 1, title: "Высокий уровень CO2", room: "A-205", priority: "high", status: "open", assignee: "Инженер", comment: "Проверить вентиляцию" },
  { id: 2, title: "Перегрев серверной", room: "B-110", priority: "high", status: "in_progress", assignee: "Администратор", comment: "Вызван мастер по кондиционерам" },
  { id: 3, title: "Не отвечает датчик", room: "B-204", priority: "medium", status: "open", assignee: "Оператор", comment: "" }
];
