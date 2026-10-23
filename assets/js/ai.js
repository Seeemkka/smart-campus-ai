// «AI»-модуль: пороги + z-score + rule-based рекомендации (без внешних API)
const mean = v => v.reduce((a, b) => a + b, 0) / v.length;
function stdDev(v) { const m = mean(v); return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length); }
function zScore(values, current) { const sd = stdDev(values); return sd === 0 ? 0 : Math.abs((current - mean(values)) / sd); }

const RANK = { normal: 0, warning: 1, critical: 2 };
const LABEL = { normal: "Норма", warning: "Внимание", critical: "Критично" };
const tempLevel = t => t >= 32 ? "critical" : (t > 27 || t < 18) ? "warning" : "normal";
const co2Level = c => c >= 1500 ? "critical" : c >= 1000 ? "warning" : "normal";
const energyLevel = r => { const k = r.energy / r.baseline; return k >= 1.6 ? "critical" : k >= 1.3 ? "warning" : "normal"; };
function roomStatus(r) {
  return [tempLevel(r.temperature), co2Level(r.co2), energyLevel(r)].sort((a, b) => RANK[b] - RANK[a])[0];
}
function getRecommendation(r) {
  if (r.co2 >= 1500) return "Критический CO2: включить вентиляцию и проверить аудиторию.";
  if (r.temperature >= 32) return "Перегрев: проверить кондиционер или систему вентиляции.";
  if (r.occupancy === 0 && r.energy > 4) return "В помещении нет людей, но энергопотребление высокое: отключить оборудование.";
  if (r.co2 >= 1000) return "CO2 повышен: проветрить помещение.";
  if (r.temperature > 27) return "Температура выше нормы: проверить климат-контроль.";
  return "Параметры в норме.";
}
// Список аномалий: причина, уровень риска, рекомендация
function findAnomalies(rooms) {
  const out = [], names = { temperature: "Температура", co2: "CO₂" }, units = { temperature: "°C", co2: " ppm" };
  rooms.forEach(r => {
    ["temperature", "co2"].forEach(p => {
      const lvl = p === "temperature" ? tempLevel(r[p]) : co2Level(r[p]);
      const z = zScore(r.history[p], r[p]);
      if (lvl !== "normal" || z > 2) {
        const reasons = [];
        if (lvl !== "normal") reasons.push("превышен порог");
        if (z > 2) reasons.push(`статистическое отклонение (z = ${z.toFixed(1)})`);
        out.push({ room: r.id, param: names[p], value: r[p] + units[p], z, risk: lvl === "normal" ? "warning" : lvl, reason: reasons.join(", "), rec: getRecommendation(r) });
      }
    });
    const el = energyLevel(r);
    if (el !== "normal") out.push({ room: r.id, param: "Энергия", value: r.energy + " kWh", z: 0, risk: el, reason: `+${Math.round((r.energy / r.baseline - 1) * 100)}% к базовой линии (${r.baseline} kWh)`, rec: getRecommendation(r) });
  });
  return out.sort((a, b) => RANK[b.risk] - RANK[a.risk]);
}
function buildAlerts(rooms, devices) {
  const a = findAnomalies(rooms).map(x => ({ level: x.risk, text: `${x.room}: ${x.param} ${x.value} — ${x.reason}` }));
  devices.filter(d => d.status === "offline").forEach(d => a.push({ level: "warning", text: `Датчик ${d.id} (${d.room}) offline` }));
  return a;
}
// Симуляция показаний датчиков
const rnd = (min, max) => +(Math.random() * (max - min) + min).toFixed(1);
function simulate() {
  const rooms = getRooms(), devices = getDevices();
  rooms.forEach(r => {
    r.history.temperature.push(r.temperature); r.history.temperature.shift();
    r.history.co2.push(r.co2); r.history.co2.shift();
    r.temperature = +Math.min(35, Math.max(18, r.temperature + rnd(-1.5, 1.5))).toFixed(1);
    r.co2 = Math.round(Math.min(1800, Math.max(400, r.co2 + rnd(-150, 150))));
    r.energy = +Math.max(0.5, r.energy + rnd(-0.8, 0.8)).toFixed(1);
  });
  devices.forEach(d => {
    const r = rooms.find(x => x.id === d.room);
    if (d.status === "online" && r) {
      if (d.type === "Temperature Sensor") d.value = r.temperature;
      if (d.type === "CO2 Sensor") d.value = r.co2;
      if (d.type === "Power Meter") d.value = r.energy;
      d.updatedAt = nowStr();
    }
  });
  saveData("sc_rooms", rooms); saveData("sc_devices", devices);
}
