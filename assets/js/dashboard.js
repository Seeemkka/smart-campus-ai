const charts = {};
function draw(id, cfg) {
  if (charts[id]) charts[id].destroy();
  Chart.defaults.color = document.body.classList.contains("light") ? "#334" : "#cbd5e1";
  cfg.options = { responsive: true, maintainAspectRatio: false };
  charts[id] = new Chart(document.getElementById(id), cfg);
}
function renderDashboard() {
  const rooms = getRooms(), devices = getDevices(), inc = getIncidents(), limit = getCampus().energyLimit;
  const online = devices.filter(d => d.status === "online").length;
  const open = inc.filter(i => i.status !== "done").length;
  const kwh = rooms.reduce((s, r) => s + r.energy, 0);
  const problem = rooms.filter(r => roomStatus(r) !== "normal").length;
  const kpi = [["🏫", "Помещений", rooms.length], ["🚨", "Проблемных помещений", problem], ["📡", "Устройств online", `${online}/${devices.length}`],
    ["⚠️", "Открытых инцидентов", open], ["⚡", "Энергия сейчас, kWh", kwh.toFixed(1)], ["🎯", "Лимит кампуса, kWh", limit]];
  document.getElementById("kpi").innerHTML = kpi.map(([i, t, v]) => `<div class="card kpi"><span>${i}</span><div><b>${v}</b><small>${t}</small></div></div>`).join("");

  const byB = BUILDINGS.map(b => +rooms.filter(r => r.building === b).reduce((s, r) => s + r.energy, 0).toFixed(1));
  draw("energyChart", { type: "bar", data: { labels: BUILDINGS, datasets: [{ label: "Энергия, kWh", data: byB, backgroundColor: "#3b82f6" }] } });
  draw("tempChart", { type: "line", data: { labels: rooms.map(r => r.id), datasets: [{ label: "Температура, °C", data: rooms.map(r => r.temperature), borderColor: "#f97316", tension: .3 }] } });
  draw("devChart", { type: "doughnut", data: { labels: ["Online", "Offline"], datasets: [{ data: [online, devices.length - online], backgroundColor: ["#22c55e", "#ef4444"] }] } });

  document.getElementById("blds").innerHTML = BUILDINGS.map((b, i) => {
    const rs = rooms.filter(r => r.building === b), bad = rs.filter(r => roomStatus(r) !== "normal").length;
    return `<div class="card bld"><img src="assets/img/building-${"abcd"[i]}.svg" alt="${b}"><div><b>${b}</b><small>${rs.length} помещений · ${byB[i]} kWh · ${bad ? "⚠ проблем: " + bad : "✅ всё в норме"}</small></div></div>`;
  }).join("");
  const al = buildAlerts(rooms, devices).slice(0, 6);
  document.getElementById("alerts").innerHTML = al.length ? al.map(a => `<div class="n ${a.level}">${esc(a.text)}</div>`).join("") : "<p>Всё в норме</p>";
}
document.getElementById("simBtn").onclick = () => { simulate(); renderDashboard(); };
window.onThemeChange = renderDashboard;
renderDashboard();
