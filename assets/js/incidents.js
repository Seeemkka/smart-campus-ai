// CRUD заявок: Create / Read / Update / Delete
let incidents = getIncidents(), editId = null;
const f = document.getElementById("form"), user = getUser();
document.getElementById("room").innerHTML = getRooms().map(r => `<option>${r.id}</option>`).join("");
const ST = { open: "Открыт", in_progress: "В работе", done: "Закрыт" }, PR = { low: "Низкий", medium: "Средний", high: "Высокий" };
function renderIncidents() {
  document.getElementById("tbody").innerHTML = incidents.map(i => `<tr>
    <td>${i.id}</td><td>${esc(i.title)}</td><td>${esc(i.room)}</td><td><span class="b ${i.priority === "high" ? "critical" : i.priority === "medium" ? "warning" : "normal"}">${PR[i.priority]}</span></td>
    <td><select data-id="${i.id}" class="st">${Object.entries(ST).map(([k, v]) => `<option value="${k}" ${k === i.status ? "selected" : ""}>${v}</option>`).join("")}</select></td>
    <td>${esc(i.assignee)}</td><td>${esc(i.comment)}</td>
    <td><button data-edit="${i.id}">✏️</button> ${user.role === "Operator" ? "" : `<button data-del="${i.id}">🗑</button>`}</td></tr>`).join("")
    || `<tr><td colspan="8">Заявок нет</td></tr>`;
}
f.addEventListener("submit", e => {
  e.preventDefault();
  const d = { title: f.title.value.trim(), room: f.room.value, priority: f.priority.value, assignee: f.assignee.value.trim() || "Не назначен", comment: f.comment.value.trim() };
  if (!d.title) return;
  if (editId) { Object.assign(incidents.find(i => i.id === editId), d); editId = null; f.querySelector("button").textContent = "Добавить"; }
  else incidents.push({ id: Date.now() % 100000, status: "open", ...d });
  saveData("sc_incidents", incidents); f.reset(); renderIncidents();
});
document.getElementById("tbody").addEventListener("click", e => {
  const del = e.target.dataset.del, ed = e.target.dataset.edit;
  if (del && confirm("Удалить заявку?")) { incidents = incidents.filter(i => i.id != del); saveData("sc_incidents", incidents); renderIncidents(); }
  if (ed) { const i = incidents.find(x => x.id == ed); editId = i.id; ["title", "room", "priority", "assignee", "comment"].forEach(k => f[k].value = i[k]); f.querySelector("button").textContent = "Сохранить"; }
});
document.getElementById("tbody").addEventListener("change", e => {
  if (e.target.classList.contains("st")) { incidents.find(i => i.id == e.target.dataset.id).status = e.target.value; saveData("sc_incidents", incidents); }
});
renderIncidents();
