const c = getCampus(), sf = document.getElementById("campusForm");
sf.cname.value = c.name; sf.limit.value = c.energyLimit;
sf.addEventListener("submit", e => { e.preventDefault(); saveData("sc_campus", { name: sf.cname.value.trim() || "Smart Campus AI", energyLimit: +sf.limit.value || 450 }); alert("Сохранено"); location.reload(); });
document.getElementById("resetBtn").onclick = () => { if (confirm("Сбросить тестовые данные?")) { resetAll(); alert("Данные сброшены"); } };
document.getElementById("themeBtn2").onclick = () => document.getElementById("themeButton").click();
