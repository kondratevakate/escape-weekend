

# Кнопка «Заказать маршрут» → Telegram

## Что делаем

Добавляем поле `telegramUsername` в профиль креатора. Кнопка «Заказать маршрут» на публичной странице открывает `https://t.me/{username}` в новой вкладке.

## Изменения

### 1. `src/types/creator.ts`
- Добавить `telegramUsername?: string` в `CreatorProfile`

### 2. `src/hooks/useCreatorProfile.ts`
- Добавить `telegramUsername: ''` в `defaultProfile`

### 3. `src/pages/CreatorDashboard.tsx`
- В секции «Планирование маршрута» (после поля цены) добавить Input для Telegram username с плейсхолдером `@username`
- Автоматически убирать `@` при сохранении

### 4. `src/pages/CreatorPublicPage.tsx`
- Кнопка «Заказать маршрут» становится ссылкой `<a href="https://t.me/{telegramUsername}" target="_blank">`
- Если username не заполнен — кнопка неактивна или скрыта

