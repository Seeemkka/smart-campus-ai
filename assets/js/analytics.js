const rooms = getRooms(), an = findAnomalies(rooms);
document.getElementById("summary").innerHTML =
  `<div class="card kpi"><span>🧠</span><div><b>${an.length}</b><small>Аномалий найдено</small></div></div>
   <div class="card kpi"><span>🔴</span><div><b>${an.filter(a => a.risk === "critical").length}</b><small>Критических</small></div></div>
   <div class="card kpi"><span>🟡</span><div><b>${an.filter(a => a.risk === "warning").length}</b><small>Предупреждений</small></div></div>`;
document.getElementById("tbody").innerHTML = an.map(a =>
  `<tr><td>${esc(a.room)}</td><td>${a.param}</td><td>${esc(a.value)}</td><td>${esc(a.reason)}</td><td><span class="b ${a.risk}">${LABEL[a.risk]}</span></td><td>${esc(a.rec)}</td></tr>`).join("")
  || `<tr><td colspan="6">Аномалий нет</td></tr>`;
let ch;
function drawCo2() {
  if (ch) ch.destroy();
  Chart.defaults.color = document.body.classList.contains("light") ? "#334" : "#cbd5e1";
  ch = new Chart(document.getElementById("co2Chart"), { type: "bar", options: { responsive: true, maintainAspectRatio: false },
    data: { labels: rooms.map(r => r.id), datasets: [{ label: "CO₂, ppm (порог 1000)", data: rooms.map(r => r.co2), backgroundColor: rooms.map(r => ({ normal: "#22c55e", warning: "#eab308", critical: "#ef4444" })[co2Level(r.co2)]) }] } });
}
window.onThemeChange = drawCo2; drawCo2();
