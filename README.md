# Smart Campus AI
Учебная веб-платформа управления кампусом: dashboard, помещения, IoT-устройства, заявки (CRUD), аналитика с обнаружением аномалий.

**Демо:** _вставьте ссылку GitHub Pages_

## Стек
HTML5, CSS3 (Grid/Flexbox, dark/light), JavaScript, localStorage, Chart.js, Git/GitHub Pages.

## Архитектура
- `index.html` — вход (роли Administrator / Engineer / Operator, имитация)
- `dashboard / rooms / devices / incidents / analytics / settings .html` — страницы
- `assets/js/data.js` — тестовые данные (14 помещений, 25 устройств)
- `assets/js/storage.js` — localStorage; `ai.js` — пороги, z-score, рекомендации; `layout.js` — sidebar, topbar, уведомления, тема

## AI Analytics
Пороги (температура, CO₂, энергия) + z-score по последним 8 показаниям (z > 2 = аномалия) + rule-based рекомендации. Это не генеративный ИИ и внешних API нет.

## Запуск
Открыть через VS Code Live Server. Публикация: GitHub Pages, ветка `main`, папка `/root`.
