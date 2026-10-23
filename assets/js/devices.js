const dq = document.getElementById("q"), dst = document.getElementById("fs");
function renderDevices() {
  const q = dq.value.toLowerCase();
  const rows = getDevices().filter(d => (!q || (d.id + d.room + d.type).toLowerCase().includes(q)) && (!dst.value || d.status === dst.value));
  document.getElementById("tbody").innerHTML = rows.map(d =>
    `<tr><td>${esc(d.id)}</td><td>${esc(d.room)}</td><td>${esc(d.type)}</td><td><span class="b ${d.status === "online" ? "normal" : "critical"}">${d.status}</span></td><td>${d.value} ${esc(d.unit)}</td><td>${esc(d.updatedAt)}</td></tr>`).join("")
    || `<tr><td colspan="6">Ничего не найдено</td></tr>`;
}
[dq, dst].forEach(el => el.addEventListener("input", renderDevices));
renderDevices();
