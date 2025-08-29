# 🚗 ГИБДД Онлайн - Telegram Mini App

Современное приложение для получения водительских прав онлайн, интегрированное с Telegram.

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установка зависимостей
npm run install:all

# Запуск в режиме разработки
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### 📱 Telegram Mini App

Приложение оптимизировано для работы в Telegram:
- Отключено выделение текста
- Фиксированный viewport
- Мобильная навигация
- Telegram Web App API интеграция

## 🌐 Деплой на Netlify

### Автоматический деплой

1. **Подключите репозиторий к Netlify**
2. **Настройки сборки:**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Base directory: `frontend`

### Переменные окружения

В Netlify установите следующие переменные:

```
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

### Конфигурация

Файл `netlify.toml` уже настроен для:
- ✅ SPA routing
- ✅ Security headers
- ✅ Caching
- ✅ API proxy

## 🏗️ Структура проекта

```
react-project/
├── frontend/           # React приложение
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── pages/      # Страницы
│   │   ├── contexts/   # Context API
│   │   └── types/      # TypeScript типы
│   ├── public/         # Статические файлы
│   └── package.json
├── backend/            # Node.js API
│   ├── src/
│   │   ├── models/     # Database модели
│   │   ├── routes/     # API маршруты
│   │   └── middleware/ # Express middleware
│   └── package.json
├── netlify.toml        # Netlify конфигурация
├── DEPLOY.md          # Инструкции по деплою
└── README.md          # Этот файл
```

## 🛠️ Технологии

### Frontend
- **React 18** с TypeScript
- **Tailwind CSS** для стилизации
- **React Router** для навигации
- **React Hook Form** для форм
- **Zod** для валидации
- **Lucide React** для иконок
- **React Hot Toast** для уведомлений

### Backend
- **Node.js** с Express
- **TypeScript**
- **Sequelize ORM** 
- **SQLite** (dev) / **PostgreSQL** (prod)
- **JWT** для аутентификации
- **Multer** для загрузки файлов
- **Telegram Bot API**

## 🔧 Локальная разработка

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp env.example .env
npm run dev
```

## 📱 Интеграция с Telegram

1. **Создайте бота через @BotFather**
2. **Получите токен**
3. **Настройте Mini App:**
   ```
   /newapp
   /editapp → выберите бота → Edit web app URL
   ```
4. **Укажите URL:** `https://your-site.netlify.app`

## 🔒 Безопасность

- CSP headers настроены
- JWT токены для API
- Валидация на клиенте и сервере
- Безопасная загрузка файлов
- IP блокировка для защиты от спама

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Убедитесь, что все переменные окружения установлены
3. Проверьте CORS настройки на backend

## 📄 Лицензия

MIT License - используйте код свободно для ваших проектов.