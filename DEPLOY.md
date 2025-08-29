# 🚀 Деплой на Netlify

## 📋 Пошаговая инструкция

### 1. Подготовка проекта

1. **Склонируйте репозиторий** или загрузите файлы проекта
2. **Убедитесь, что все зависимости установлены:**
   ```bash
   cd react-project/frontend
   npm install
   ```

### 2. Настройка Netlify

1. **Войдите в Netlify:** https://app.netlify.com
2. **Нажмите "Add new site" → "Import an existing project"**
3. **Подключите ваш Git репозиторий** (GitHub, GitLab, Bitbucket)

### 3. Настройки деплоя

В настройках сайта на Netlify установите:

**Build settings:**
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/build`

### 4. Переменные окружения

В разделе **Site settings → Environment variables** добавьте:

```
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### 5. Backend деплой

Для backend рекомендуется использовать:
- **Heroku** (бесплатный план)
- **Railway** 
- **DigitalOcean App Platform**
- **AWS Lambda** (для serverless)

### 6. Настройка домена

1. В Netlify перейдите в **Site settings → Domain management**
2. Добавьте свой домен или используйте автоматически сгенерированный
3. Настройте HTTPS (включено по умолчанию)

## 🔧 Автоматические настройки

Файл `netlify.toml` уже настроен для:
- ✅ SPA роутинга (React Router)
- ✅ Безопасности (CSP headers)
- ✅ Кеширования статических файлов
- ✅ Проксирования API запросов

## 🌐 API Backend

Если нужен backend, рекомендуемые варианты:

### Option 1: Heroku
```bash
# Создайте отдельный репозиторий для backend
git subtree push --prefix=backend heroku main
```

### Option 2: Railway
1. Подключите backend папку к Railway
2. Настройте переменные окружения
3. Обновите URL в Netlify переменных

### Option 3: Serverless (Netlify Functions)
- Переместите API логику в `frontend/netlify/functions/`
- Используйте serverless подход

## 📱 Telegram Mini App настройка

1. **Создайте бота через @BotFather**
2. **Получите токен бота**
3. **Настройте веб-приложение:**
   ```
   /newapp
   /editapp → ваш_бот → Edit web app URL
   ```
4. **Укажите URL:** `https://your-site.netlify.app`

## 🔍 Проверка деплоя

После деплоя проверьте:
- ✅ Сайт открывается без ошибок
- ✅ Навигация работает (React Router)
- ✅ API запросы проходят
- ✅ Telegram Mini App интеграция
- ✅ Мобильная версия работает корректно

## 🛠️ Troubleshooting

### Проблема: "Page not found" при обновлении страницы
**Решение:** Проверьте настройки redirects в `netlify.toml`

### Проблема: API запросы не работают
**Решение:** 
1. Проверьте переменную `REACT_APP_API_BASE_URL`
2. Настройте CORS на backend
3. Проверьте redirects для `/api/*`

### Проблема: Telegram Mini App не работает
**Решение:**
1. Проверьте HTTPS (обязательно для Telegram)
2. Добавьте домен в настройки бота
3. Проверьте CSP headers

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи деплоя в Netlify
2. Откройте консоль браузера для JavaScript ошибок
3. Проверьте Network tab для API запросов
