# Сайт стримера holy_father_215

Статический сайт (без сборки и зависимостей): HTML + CSS + ванильный JS.

## Что внутри

- **Монитор стрима** — Twitch-плеер канала `holy_father_215`.
- **Чат** — Twitch-чат канала прямо рядом с плеером.
- **Донат** — кнопки на [DonationAlerts](https://www.donationalerts.com/r/holy_father_215).
- **Расписание** — «Аук каждый день», воскресенье выделено: формат выбирает Telegram.
- **Telegram** — ссылки на [@holyfather215](https://t.me/holyfather215).
- Тёмный «неоновый» дизайн, адаптив от 360px, анимации с учётом `prefers-reduced-motion`,
  мобильное меню, проверка статуса эфира.

## Структура

```
index.html        разметка страницы
styles.css        оформление
script.js         плеер/чат Twitch, статус эфира, меню, анимации
assets/           аватар для hero-блока
favicon.svg       иконка сайта
```

## Как запустить локально

```bash
python3 -m http.server 4173
# открыть http://localhost:4173
```

## Важно про Twitch-встраивание

Twitch требует, чтобы параметр `parent` в ссылке плеера и чата совпадал с доменом,
на котором открыт сайт. Здесь `parent` подставляется автоматически из `location.hostname`
в `script.js`, поэтому сайт работает на любом хостинге без правок кода:

- локально → `parent=localhost`
- на GitHub Pages → `parent=username.github.io`
- на своём домене → `parent=ваш-домен.ru`

Если нужно жёстко зафиксировать домены, задайте их вручную, например:
`...&parent=your-domain.ru&parent=www.your-domain.ru`.

## Публикация

Подойдёт любой статический хостинг: GitHub Pages, Netlify, Vercel, Cloudflare Pages.
Для GitHub Pages достаточно включить Pages в настройках репозитория (ветка `main`, папка `/`).

## Ссылки

- Twitch: https://www.twitch.tv/holy_father_215
- Telegram: https://t.me/holyfather215
- Донат: https://www.donationalerts.com/r/holy_father_215
