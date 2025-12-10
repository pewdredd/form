# 📍 Address Form - Форма выбора адреса

React-приложение для выбора адреса с автодополнением через DaData API и отправкой данных на N8N webhook.

## ✨ Возможности

- 🔍 **Автодополнение адресов** через DaData API
- 🔗 **Query параметры** - передача `user_id` и `session_id` через URL
- 📤 **Webhook интеграция** - отправка данных на N8N webhook
- 🐳 **Docker-ready** - готов к развертыванию в контейнере
- 📱 **Responsive** - адаптивный дизайн для всех устройств
- ⚡ **Vite + React** - быстрая разработка и сборка

---

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- npm или yarn
- DaData API токен ([получить здесь](https://dadata.ru))
- N8N webhook URL

### 1. Установка зависимостей

```bash
cd address-form
npm install
```

### 2. Настройка переменных окружения

Создай файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируй `.env` и добавь свои данные:

```bash
# DaData API Token
VITE_DADATA_TOKEN=your_dadata_token_here

# N8N Webhook URL
VITE_WEBHOOK_URL=https://your-n8n-instance.com/webhook/address-form
```

### 3. Запуск dev-сервера

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### 4. Тестирование с query параметрами

Открой в браузере:

```bash
# С обоими параметрами
http://localhost:5173/?user_id=123&session_id=abc-def-789

# Только user_id
http://localhost:5173/?user_id=123

# Без параметров
http://localhost:5173/
```

---

## 🐳 Docker деплой

### Вариант 1: Docker Build + Run

```bash
# Сборка образа
docker build \
  --build-arg VITE_DADATA_TOKEN=your_token \
  --build-arg VITE_WEBHOOK_URL=https://your-webhook-url \
  -t address-form .

# Запуск контейнера
docker run -d \
  -p 8080:80 \
  --name address-form \
  --restart unless-stopped \
  address-form

# Проверка
curl http://localhost:8080
```

### Вариант 2: Docker Compose

1. Создай `.env` файл с переменными
2. Запусти:

```bash
docker-compose up -d
```

3. Проверь:

```bash
curl http://localhost:8080
```

### Логи Docker

```bash
# Просмотр логов
docker logs address-form

# Следить за логами в реальном времени
docker logs -f address-form
```

---

## 📦 Production сборка

```bash
# Сборка для production
npm run build

# Результат будет в папке dist/
# Можно разместить на любом статическом хостинге
```

---

## 🌐 Деплой на сервер

### Шаг 1: Подготовка сервера

```bash
# Подключись к серверу
ssh user@your-server.com

# Установи Docker (если еще не установлен)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установи Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Шаг 2: Загрузка проекта на сервер

```bash
# На локальной машине
scp -r address-form user@your-server.com:/home/user/

# Или через git
ssh user@your-server.com
git clone <your-repo-url>
cd address-form
```

### Шаг 3: Настройка и запуск

```bash
# На сервере
cd /home/user/address-form

# Создай .env
nano .env
# Вставь свои VITE_DADATA_TOKEN и VITE_WEBHOOK_URL

# Запусти Docker Compose
docker-compose up -d

# Проверь статус
docker ps
docker logs address-form
```

### Шаг 4: Настройка домена (опционально)

Установи nginx как reverse proxy:

```bash
# Установи nginx
sudo apt update
sudo apt install nginx

# Создай конфиг
sudo nano /etc/nginx/sites-available/address-form
```

Добавь конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируй конфиг:

```bash
# Создай симлинк
sudo ln -s /etc/nginx/sites-available/address-form /etc/nginx/sites-enabled/

# Проверь конфигурацию
sudo nginx -t

# Перезапусти nginx
sudo systemctl restart nginx
```

### Шаг 5: SSL (Let's Encrypt)

```bash
# Установи certbot
sudo apt install certbot python3-certbot-nginx

# Получи SSL сертификат
sudo certbot --nginx -d your-domain.com

# Автообновление сертификата (проверь)
sudo certbot renew --dry-run
```

---

## 📝 Структура проекта

```
address-form/
├── Dockerfile              # Docker образ
├── docker-compose.yml      # Docker Compose конфигурация
├── nginx.conf              # Nginx конфигурация для контейнера
├── package.json            # Зависимости проекта
├── vite.config.ts          # Vite конфигурация
├── tsconfig.json           # TypeScript конфигурация
├── .env.example            # Пример переменных окружения
├── .gitignore              # Игнорируемые файлы
├── README.md               # Эта документация
│
├── public/                 # Статические файлы
│
└── src/
    ├── main.tsx            # Точка входа
    ├── App.tsx             # Главный компонент
    ├── App.css             # Стили приложения
    ├── index.css           # Глобальные стили
    │
    ├── components/
    │   ├── AddressForm.tsx # Компонент формы
    │   └── AddressForm.css # Стили формы
    │
    ├── hooks/
    │   └── useQueryParams.ts # Хук для query параметров
    │
    ├── services/
    │   └── api.ts          # API сервис для webhook
    │
    └── types/
        └── dadata.types.ts # TypeScript типы
```

---

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Обязательная | Описание | Пример |
|-----------|--------------|----------|--------|
| `VITE_DADATA_TOKEN` | ✅ | API токен DaData | `abc123...` |
| `VITE_WEBHOOK_URL` | ✅ | URL N8N webhook | `https://n8n.example.com/webhook/address` |

### Формат данных webhook

Твой N8N webhook получит следующий JSON:

```json
{
  "user_id": "12345",
  "session_id": "abc-def-789",
  "address": {
    "value": "г Москва, ул Льва Толстого, д 16",
    "unrestricted_value": "119021, г Москва, р-н Хамовники, ул Льва Толстого, д 16",
    "data": {
      "postal_code": "119021",
      "country": "Россия",
      "country_iso_code": "RU",
      "region": "Москва",
      "city": "Москва",
      "street": "Льва Толстого",
      "house": "16",
      "geo_lat": "55.733771",
      "geo_lon": "37.587937"
    }
  },
  "timestamp": "2025-12-10T12:34:56.789Z",
  "source": "address_form"
}
```

---

## 🧪 Тестирование

### Локальное тестирование

```bash
# Запусти dev-сервер
npm run dev

# Открой в браузере
http://localhost:5173/?user_id=test123&session_id=test-session
```

### Docker тестирование

```bash
# Собери и запусти
docker-compose up --build

# Проверь
curl "http://localhost:8080/?user_id=test123&session_id=test-session"
```

### Проверка webhook

1. Открой консоль браузера (F12)
2. Заполни форму и отправь
3. Проверь Network tab - должен быть POST запрос на webhook
4. Проверь N8N - данные должны прийти

---

## 🛠️ Разработка

### Доступные команды

```bash
# Dev-сервер с hot reload
npm run dev

# Production сборка
npm run build

# Превью production сборки
npm run preview

# Линтинг
npm run lint
```

### Добавление новых полей в форму

1. Открой `src/components/AddressForm.tsx`
2. Добавь новое состояние:
```typescript
const [phone, setPhone] = useState('');
```
3. Добавь поле в JSX
4. Обнови `sendAddressData` в `handleSubmit`

---

## ❓ FAQ

### Ошибка "VITE_DADATA_TOKEN не настроен"

Создай `.env` файл и добавь токен:
```bash
VITE_DADATA_TOKEN=your_token_here
```

### Webhook не отвечает

1. Проверь URL в `.env`
2. Убедись что N8N доступен извне
3. Проверь CORS настройки в N8N
4. Смотри логи в консоли браузера

### Docker не стартует

```bash
# Проверь логи
docker logs address-form

# Проверь порты
sudo netstat -tulpn | grep 8080

# Пересобери образ
docker-compose down
docker-compose up --build
```

---

## 📄 Лицензия

MIT

---

## 🤝 Поддержка

Если возникли вопросы или проблемы, создай issue в репозитории или обратись к документации:

- [DaData API Docs](https://dadata.ru/api/)
- [React DaData Docs](https://github.com/vitalybaev/react-dadata)
- [N8N Docs](https://docs.n8n.io/)
- [Vite Docs](https://vitejs.dev/)

---

**Создано с ❤️ для автоматизации с N8N**
