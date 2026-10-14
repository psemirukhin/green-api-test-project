# green-api-test-project

Веб-интерфейс чата для мессенджера **MAX** через [GREEN-API](https://green-api.com/max): вход по данным инстанса, создание чата по номеру, отправка и приём текстовых сообщений.

Демо: [https://psemirukhin.github.io/green-api-test-project/](https://psemirukhin.github.io/green-api-test-project/)

## Стек

- React 18 (JavaScript)
- Material UI (`@mui/material`, `@mui/styles`, `@mui/icons-material`)
- Webpack 5 + Babel
- HTTP через `fetch`

## Требования

- Node.js 18+ и npm
- Аккаунт [GREEN-API](https://green-api.com/) с инстансом **MAX**, авторизованным в приложении
- Из личного кабинета инстанса: `apiUrl`, `idInstance`, `apiTokenInstance`

## Настройка инстанса для приёма сообщений

Для получения входящих через HTTP API (`ReceiveNotification`):

1. В личном кабинете откройте настройки инстанса.
2. Поле **URL вебхука** (`webhookUrl`) оставьте **пустым**.
3. Включите получение уведомлений о **входящих сообщениях и файлах** (`incomingWebhook`).

Без этого ответы из MAX в приложении могут не появляться. В интерфейсе отображаются только текстовые сообщения.

## Запуск

```bash
npm install
npm start
```

Приложение: [http://localhost:3000](http://localhost:3000)

Сборка production:

```bash
npm run build
```

Пуш в `main` публикует сборку на [GitHub Pages](https://psemirukhin.github.io/green-api-test-project/).

## Как пользоваться

1. **Вход** — укажите `apiUrl`, `idInstance` и `apiTokenInstance`. Данные проверяются методом `getStateInstance`. При включённом чекбоксе **«Запомнить»** они сохраняются в `localStorage`.
2. **Новый чат** — введите номер получателя в международном формате:
   - РФ: 11 цифр с кодом `7` (номер с `8` будет преобразован в `7…`);
   - РБ: 12 цифр с кодом `375`.  
   Пример: `79991234567`. Чат создаётся через `checkAccount`.
3. **Переписка** — введите текст и отправьте **Enter** или кнопкой со стрелкой. **Shift+Enter** — новая строка. Отправка: `sendMessage`.
4. **Ответ** — напишите ответ в MAX с телефона получателя. При открытом чате приложение опрашивает очередь (`receiveNotification` / `deleteNotification`) и показывает входящие текстовые сообщения слева.
5. Кнопки **«Новый чат»** и **«Выйти»** — сменить собеседника или выйти из инстанса.
