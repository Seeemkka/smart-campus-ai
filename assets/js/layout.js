// Общий каркас: sidebar, topbar, уведомления, тема, проверка входа
(function () {
  if (loadData("sc_theme", "dark") === "light") document.body.classList.add("light");
  const page = document.body.dataset.page;
  if (page === "login") return;
  const user = getUser();
  if (!user) { location.href = "index.html"; return; }
  const nav = [["dashboard", "Dashboard", "▦"], ["rooms", "Rooms", "🏫"], ["devices", "Devices", "📡"], ["incidents", "Incidents", "🛠"], ["analytics", "Analytics", "🧠"], ["settings", "Settings", "⚙"]];
  const alerts = buildAlerts(getRooms(), getDevices());
  const content = document.getElementById("page");
  const shell = document.createElement("div");
  shell.className = "shell";
  shell.innerHTML = `
  <aside class="sidebar" id="sidebar"><div class="logo"><img src="assets/img/logo.svg" alt="">${esc(getCampus().name)}</div>
    ${nav.map(([k, t, i]) => `<a href="${k}.html" class="${k === page ? "active" : ""}">${i} ${t}</a>`).join("")}
  </aside>
  <div class="main"><header class="topbar">
    <button class="icon" id="burger" aria-label="Меню">☰</button>
    <input id="globalSearch" type="search" placeholder="Поиск аудитории… (Enter)">
    <button class="icon" id="themeButton" title="Тема">🌓</button>
    <div class="bell"><button class="icon" id="bellBtn">🔔<span class="count">${alerts.length}</span></button>
      <div class="notif" id="notif" hidden><h4>Уведомления</h4>${alerts.length ? alerts.map(a => `<div class="n ${a.level}">${esc(a.text)}</div>`).join("") : "<p>Нет предупреждений</p>"}</div></div>
    <div class="profile">👤 ${esc(user.name)} <small>${esc(user.role)}</small> <a href="#" id="logout">Выйти</a></div>
  </header><main class="content"></main></div>`;
  document.body.prepend(shell);
  shell.querySelector(".content").appendChild(content);

  document.getElementById("themeButton").onclick = () => {
    document.body.classList.toggle("light");
    saveData("sc_theme", document.body.classList.contains("light") ? "light" : "dark");
    if (window.onThemeChange) window.onThemeChange();
  };
  document.getElementById("burger").onclick = () => document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("bellBtn").onclick = () => { const n = document.getElementById("notif"); n.hidden = !n.hidden; };
  document.getElementById("logout").onclick = e => { e.preventDefault(); localStorage.removeItem("sc_user"); location.href = "index.html"; };
  document.getElementById("globalSearch").addEventListener("keydown", e => {
    if (e.key === "Enter") location.href = "rooms.html?q=" + encodeURIComponent(e.target.value);
  });
})();
