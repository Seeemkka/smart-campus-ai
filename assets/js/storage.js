// Работа с localStorage
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function loadData(key, fallback = []) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
// Экранирование: защита от XSS при выводе пользовательского текста
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function getRooms() {
  let r = loadData("sc_rooms", null);
  if (!r || !r.length) { r = makeRooms(); saveData("sc_rooms", r); }
  return r;
}
function getDevices() {
  let d = loadData("sc_devices", null);
  if (!d || !d.length) { d = makeDevices(getRooms()); saveData("sc_devices", d); }
  return d;
}
function getIncidents() {
  let i = loadData("sc_incidents", null);
  if (!i) { i = SEED_INCIDENTS; saveData("sc_incidents", i); }
  return i;
}
function resetAll() { ["sc_rooms", "sc_devices", "sc_incidents"].forEach(k => localStorage.removeItem(k)); }
const getUser = () => loadData("sc_user", null);
const getCampus = () => loadData("sc_campus", { name: "Smart Campus AI", energyLimit: 450 });
