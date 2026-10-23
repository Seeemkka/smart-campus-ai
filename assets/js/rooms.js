const s = document.getElementById("q"), fb = document.getElementById("fb"), fs = document.getElementById("fs");
s.value = new URLSearchParams(location.search).get("q") || "";
fb.innerHTML += BUILDINGS.map(b => `<option>${b}</option>`).join("");
function renderRooms() {
  const q = s.value.toLowerCase();
  const rows = getRooms().filter(r => (!q || r.id.toLowerCase().includes(q) || r.type.toLowerCase().includes(q))
    && (!fb.value || r.building === fb.value) && (!fs.value || roomStatus(r) === fs.value));
  document.getElementById("tbody").innerHTML = rows.map(r => { const st = roomStatus(r);
    return `<tr><td>${esc(r.id)}</td><td>${esc(r.building)}</td><td>${r.floor}</td><td>${esc(r.type)}</td><td>${r.temperature} °C</td><td>${r.co2} ppm</td><td>${r.energy} kWh</td><td>${r.occupancy}</td><td><span class="b ${st}">${LABEL[st]}</span></td></tr>`; }).join("")
    || `<tr><td colspan="9">Ничего не найдено</td></tr>`;
}
[s, fb, fs].forEach(el => el.addEventListener("input", renderRooms));
renderRooms();
