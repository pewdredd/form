# 🛠️ Developer Guide - Address Form

Техническая документация для разработчиков. Все что нужно знать для внесения изменений в проект.

---

## 📋 Оглавление

1. [Архитектура проекта](#архитектура-проекта)
2. [Структура файлов](#структура-файлов)
3. [Технологический стек](#технологический-стек)
4. [Основные компоненты](#основные-компоненты)
5. [Как добавить новые поля](#как-добавить-новые-поля)
6. [Работа с query параметрами](#работа-с-query-параметрами)
7. [Изменение стилей](#изменение-стилей)
8. [Работа с API](#работа-с-api)
9. [Типы данных](#типы-данных)
10. [Тестирование](#тестирование)
11. [Деплой](#деплой)
12. [Частые проблемы](#частые-проблемы)

---

## 🏗️ Архитектура проекта

### Общая схема

```
User Browser
     │
     ├─── Query Params (?user_id=X&session_id=Y)
     │
     ▼
┌─────────────────────────────────────┐
│   React App (SPA)                   │
│                                     │
│   ┌──────────────────────────┐    │
│   │  useQueryParams Hook     │    │
│   │  (читает URL)            │    │
│   └──────────┬───────────────┘    │
│              │                      │
│              ▼                      │
│   ┌──────────────────────────┐    │
│   │  AddressForm Component   │    │
│   │  - DaData подсказки      │    │
│   │  - Валидация             │    │
│   │  - Отправка данных       │    │
│   └──────────┬───────────────┘    │
│              │                      │
│              ▼                      │
│   ┌──────────────────────────┐    │
│   │  API Service             │    │
│   │  (axios POST)            │    │
│   └──────────┬───────────────┘    │
└──────────────┼──────────────────────┘
               │
               ▼
         N8N Webhook
         (обработка данных)
```

### Поток данных

```
1. URL → useQueryParams → { user_id, session_id }
2. User вводит адрес → DaData API → Подсказки
3. User выбирает → address object
4. Submit → sendAddressData()
5. POST → N8N Webhook
6. Response → Success/Error message
```

---

## 📁 Структура файлов

```
address-form/
│
├── 📦 Config & Build
│   ├── package.json              # Зависимости и скрипты
│   ├── tsconfig.json             # TypeScript конфиг
│   ├── tsconfig.node.json        # TypeScript для Vite
│   ├── vite.config.ts            # Vite конфигурация
│   ├── .env.example              # Пример переменных окружения
│   ├── .gitignore                # Git ignore правила
│   ├── Dockerfile                # Docker multi-stage build
│   ├── docker-compose.yml        # Docker Compose setup
│   └── nginx.conf                # Nginx для production
│
├── 📚 Documentation
│   ├── README.md                 # User documentation
│   ├── IMPLEMENTATION_PLAN.md    # План реализации
│   └── DEVELOPER_GUIDE.md        # Эта документация
│
├── 🌐 Public Assets
│   └── public/
│       └── (статические файлы)
│
└── ⚛️ Source Code
    ├── index.html                # Entry HTML
    │
    └── src/
        ├── main.tsx              # React entry point
        ├── App.tsx               # Root component
        ├── App.css               # App styles
        ├── index.css             # Global styles
        │
        ├── components/           # React компоненты
        │   ├── AddressForm.tsx   # Главная форма
        │   └── AddressForm.css   # Стили формы
        │
        ├── hooks/                # Custom React hooks
        │   └── useQueryParams.ts # URL параметры
        │
        ├── services/             # API сервисы
        │   └── api.ts            # Webhook API
        │
        └── types/                # TypeScript типы
            └── dadata.types.ts   # DaData типы
```

---

## 🔧 Технологический стек

| Технология | Версия | Назначение |
|-----------|--------|-----------|
| **React** | 18.2+ | UI библиотека |
| **TypeScript** | 5.2+ | Типизация |
| **Vite** | 5.0+ | Build tool & dev server |
| **react-dadata** | 2.23+ | DaData интеграция |
| **Axios** | 1.6+ | HTTP client |
| **Docker** | 20.10+ | Контейнеризация |
| **Nginx** | Alpine | Web server |

### Почему именно эти технологии?

- **React 18** - Современная версия с улучшенной производительностью
- **TypeScript** - Статическая типизация предотвращает ошибки
- **Vite** - Быстрый dev-сервер, мгновенный HMR
- **react-dadata** - Готовое решение для DaData, проверенное
- **Axios** - Удобный API, interceptors, timeout
- **Docker** - Изоляция, легкий деплой

---

## 🧩 Основные компоненты

### 1. AddressForm Component

**Расположение:** `src/components/AddressForm.tsx`

**Описание:** Главный компонент формы с DaData автодополнением.

**State:**
```typescript
const [address, setAddress] = useState<DaDataSuggestion<DaDataAddress>>();
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
```

**Props:** Нет (использует хуки)

**Основные функции:**

#### `handleSubmit(e: React.FormEvent)`
Обрабатывает отправку формы:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Валидация
  if (!address) {
    setError('Пожалуйста, выберите адрес из списка');
    return;
  }

  setLoading(true);

  try {
    // Отправка на webhook
    await sendAddressData({
      address,
      user_id,
      session_id,
    });

    setSuccess(true);
    setAddress(undefined); // Очистка формы
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Ключевые особенности:**
- Валидация обязательных полей
- Loading states для UX
- Автоочистка формы после успешной отправки
- Error handling с понятными сообщениями
- Debug информация (показывает query параметры)

---

### 2. useQueryParams Hook

**Расположение:** `src/hooks/useQueryParams.ts`

**Описание:** Читает query параметры из URL.

**Возвращает:**
```typescript
interface QueryParams {
  user_id?: string;
  session_id?: string;
}
```

**Использование:**
```typescript
const { user_id, session_id } = useQueryParams();
```

**Как работает:**
```typescript
export const useQueryParams = (): QueryParams => {
  const [params, setParams] = useState<QueryParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    setParams({
      user_id: searchParams.get('user_id') || undefined,
      session_id: searchParams.get('session_id') || undefined,
    });

    // Debug logging
    console.log('Query params:', { user_id, session_id });
  }, []);

  return params;
};
```

**Особенности:**
- Работает при монтировании компонента
- Возвращает `undefined` если параметра нет
- Логирует параметры в консоль для отладки

---

### 3. API Service

**Расположение:** `src/services/api.ts`

**Описание:** Отправка данных на N8N webhook.

**Основная функция:**

```typescript
export const sendAddressData = async (data: AddressPayload) => {
  if (!WEBHOOK_URL) {
    throw new Error('VITE_WEBHOOK_URL не настроен');
  }

  const payload = {
    ...data,
    timestamp: new Date().toISOString(),
    source: 'address_form',
  };

  const response = await axios.post(WEBHOOK_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // 10 секунд
  });

  return response.data;
};
```

**Error handling:**
```typescript
try {
  // ...
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(`Webhook вернул ошибку: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Webhook не отвечает');
    }
  }
  throw new Error('Неизвестная ошибка');
}
```

---

## ➕ Как добавить новые поля

### Пример: Добавить поле "Телефон"

#### Шаг 1: Обновить компонент

**Файл:** `src/components/AddressForm.tsx`

```typescript
// 1. Добавить state
const [phone, setPhone] = useState('');

// 2. Добавить поле в JSX (после AddressSuggestions)
<div className="form-group">
  <label htmlFor="phone">
    Телефон: <span className="required">*</span>
  </label>
  <input
    type="tel"
    id="phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="+7 (999) 123-45-67"
    required
  />
</div>

// 3. Обновить handleSubmit - добавить валидацию
if (!phone) {
  setError('Укажите номер телефона');
  return;
}

// 4. Добавить phone в sendAddressData
await sendAddressData({
  address,
  user_id,
  session_id,
  phone, // ← новое поле
});
```

#### Шаг 2: Обновить типы

**Файл:** `src/types/dadata.types.ts`

```typescript
export interface WebhookPayload {
  user_id?: string;
  session_id?: string;
  address: DaDataSuggestion<DaDataAddress> | null;
  phone?: string; // ← добавить
  timestamp: string;
  source: string;
}
```

#### Шаг 3: Обновить API service

**Файл:** `src/services/api.ts`

```typescript
interface AddressPayload {
  address: DaDataSuggestion<DaDataAddress> | undefined;
  user_id?: string;
  session_id?: string;
  phone?: string; // ← добавить
}
```

#### Шаг 4: Добавить стили (опционально)

**Файл:** `src/components/AddressForm.css`

```css
input[type="tel"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 15px;
  transition: border 0.2s;
}

input[type="tel"]:focus {
  outline: none;
  border-color: #667eea;
}
```

#### Шаг 5: Тестирование

```bash
# Запусти dev-сервер
npm run dev

# Заполни форму и проверь:
# 1. Поле телефона отображается
# 2. Валидация работает
# 3. Данные уходят на webhook с полем phone
```

---

## 🔗 Работа с query параметрами

### Добавить новый query параметр

#### Пример: Добавить `order_id`

**Шаг 1:** Обновить типы

**Файл:** `src/types/dadata.types.ts`

```typescript
export interface QueryParams {
  user_id?: string;
  session_id?: string;
  order_id?: string; // ← новый параметр
}
```

**Шаг 2:** Обновить хук

**Файл:** `src/hooks/useQueryParams.ts`

```typescript
setParams({
  user_id: searchParams.get('user_id') || undefined,
  session_id: searchParams.get('session_id') || undefined,
  order_id: searchParams.get('order_id') || undefined, // ← добавить
});
```

**Шаг 3:** Использовать в форме

**Файл:** `src/components/AddressForm.tsx`

```typescript
const { user_id, session_id, order_id } = useQueryParams();

// Отправить на webhook
await sendAddressData({
  address,
  user_id,
  session_id,
  order_id, // ← добавить
});
```

**Шаг 4:** Тестировать

```bash
http://localhost:5173/?user_id=123&session_id=abc&order_id=ORD-456
```

---

## 🎨 Изменение стилей

### Структура стилей

```
src/
├── index.css              # Глобальные стили (body, #root)
├── App.css                # Стили App компонента
└── components/
    └── AddressForm.css    # Стили формы
```

### Глобальные стили

**Файл:** `src/index.css`

Изменить цветовую схему:

```css
:root {
  /* Основные цвета */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* Цвета статусов */
  --success-color: #10b981;
  --error-color: #e53e3e;
  --warning-color: #f59e0b;

  /* Нейтральные */
  --text-color: #2d3748;
  --border-color: #e2e8f0;
}

body {
  background: var(--background-gradient);
}
```

### Стили формы

**Файл:** `src/components/AddressForm.css`

#### Изменить фон контейнера:

```css
.address-form-container {
  background: #ffffff; /* или любой другой цвет */
  border-radius: 12px;
  padding: 40px;
}
```

#### Изменить кнопку:

```css
.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Или однотонный: */
  /* background: #667eea; */
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}
```

#### Изменить стили DaData подсказок:

```css
/* Override react-dadata стилей */
.react-dadata__suggestions {
  background: #ffffff;
  color: #333333; /* Цвет текста подсказок */
  border-radius: 6px;
}

.react-dadata__suggestion {
  color: #333333; /* Цвет текста отдельной подсказки */
  padding: 12px 16px;
}

.react-dadata__suggestion:hover {
  background: #f7fafc; /* Фон при наведении */
}

.react-dadata__suggestion--current {
  background: #edf2f7; /* Фон выбранной подсказки */
}
```

### Responsive стили

```css
@media (max-width: 640px) {
  .address-form-container {
    padding: 24px 20px;
  }

  h1 {
    font-size: 22px;
  }

  .submit-button {
    padding: 12px 16px;
    font-size: 15px;
  }
}
```

---

## 🌐 Работа с API

### Конфигурация

**Переменная окружения:**
```bash
VITE_WEBHOOK_URL=https://your-n8n-instance.com/webhook/address-form
```

### Изменить timeout

**Файл:** `src/services/api.ts`

```typescript
const response = await axios.post(WEBHOOK_URL, payload, {
  timeout: 20000, // 20 секунд вместо 10
});
```

### Добавить headers

```typescript
const response = await axios.post(WEBHOOK_URL, payload, {
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value',
    'Authorization': `Bearer ${token}`,
  },
});
```

### Добавить retry логику

```typescript
const MAX_RETRIES = 3;

export const sendAddressData = async (data: AddressPayload) => {
  let lastError;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await axios.post(WEBHOOK_URL, payload);
      return response.data;
    } catch (error) {
      lastError = error;
      console.log(`Попытка ${i + 1} не удалась, повторяем...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw lastError;
};
```

### Interceptors (для логирования)

```typescript
// Добавить в начало файла api.ts
axios.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status);
    return Promise.reject(error);
  }
);
```

---

## 📊 Типы данных

### DaData Address типы

**Файл:** `src/types/dadata.types.ts`

```typescript
// Импорт из react-dadata
import type {
  DaDataSuggestion,
  DaDataAddress,
  DaDataAddressSuggestion
} from 'react-dadata';

// DaDataAddress содержит:
interface DaDataAddress {
  // Основные поля
  postal_code: string;      // "119021"
  country: string;          // "Россия"
  country_iso_code: string; // "RU"
  region: string;           // "Москва"
  city: string;             // "Москва"
  street: string;           // "Льва Толстого"
  house: string;            // "16"
  flat: string | null;      // "25" или null

  // Координаты
  geo_lat: string;          // "55.733771"
  geo_lon: string;          // "37.587937"

  // ФИАС коды
  fias_id: string;
  fias_level: string;

  // И много других полей...
}

// DaDataSuggestion структура:
interface DaDataSuggestion<T> {
  value: string;              // Краткое значение
  unrestricted_value: string; // Полное значение
  data: T;                    // Детальные данные (DaDataAddress)
}
```

### Webhook Payload

```typescript
export interface WebhookPayload {
  user_id?: string;
  session_id?: string;
  address: DaDataSuggestion<DaDataAddress> | null;
  timestamp: string;  // ISO 8601 формат
  source: string;     // "address_form"
}
```

### Пример реального объекта

```typescript
const examplePayload: WebhookPayload = {
  user_id: "12345",
  session_id: "abc-def-789",
  address: {
    value: "г Москва, ул Льва Толстого, д 16",
    unrestricted_value: "119021, г Москва, р-н Хамовники, ул Льва Толстого, д 16",
    data: {
      postal_code: "119021",
      country: "Россия",
      country_iso_code: "RU",
      region: "Москва",
      city: "Москва",
      street: "Льва Толстого",
      house: "16",
      flat: null,
      geo_lat: "55.733771",
      geo_lon: "37.587936"
      // + еще ~50 полей
    }
  },
  timestamp: "2025-12-10T12:34:56.789Z",
  source: "address_form"
};
```

---

## 🧪 Тестирование

### Локальное тестирование

#### 1. Запуск dev-сервера

```bash
npm run dev
```

#### 2. Тестовые URL

```bash
# Минимальный тест
http://localhost:5173/

# С query параметрами
http://localhost:5173/?user_id=test123&session_id=session-abc

# С кириллицей (URL encoded)
http://localhost:5173/?user_id=тест&session_id=сессия
```

#### 3. Проверка в браузере

**Откройте DevTools (F12):**

- **Console** - логи приложения
- **Network** - проверить запросы к DaData и webhook
- **Application → Local Storage** - нет (не используем)

#### 4. Mock webhook для тестов

Создай временный mock webhook:

```typescript
// В src/services/api.ts добавь для тестов:
const MOCK_MODE = import.meta.env.VITE_MOCK_WEBHOOK === 'true';

export const sendAddressData = async (data: AddressPayload) => {
  if (MOCK_MODE) {
    console.log('🎭 MOCK MODE: Данные не отправлены', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Mock success' };
  }

  // Обычная логика...
};
```

В `.env`:
```bash
VITE_MOCK_WEBHOOK=true
```

### Тестирование webhook

#### Использовать webhook.site для тестов

1. Открой https://webhook.site
2. Скопируй уникальный URL
3. Добавь в `.env`:
```bash
VITE_WEBHOOK_URL=https://webhook.site/your-unique-id
```
4. Отправь форму
5. Проверь данные на webhook.site

#### Локальный N8N для тестов

```bash
# Запусти N8N локально
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  n8nio/n8n

# Webhook URL будет:
http://localhost:5678/webhook/test
```

---

## 🚀 Деплой

### Production Build

```bash
# Сборка для production
npm run build

# Результат в папке dist/
# Содержит:
# - index.html
# - assets/index-abc123.js
# - assets/index-def456.css
```

### Docker Build

```bash
# Multi-stage build
docker build \
  --build-arg VITE_DADATA_TOKEN=your_token \
  --build-arg VITE_WEBHOOK_URL=https://webhook-url \
  -t address-form:latest .

# Check image size
docker images address-form

# Должен быть ~50-80 MB (Alpine + Nginx)
```

### Деплой на сервер

#### Вариант 1: Docker

```bash
# На сервере
docker pull your-registry/address-form:latest
docker stop address-form || true
docker rm address-form || true
docker run -d \
  -p 8080:80 \
  --name address-form \
  --restart unless-stopped \
  address-form:latest
```

#### Вариант 2: Nginx

```bash
# Build локально
npm run build

# Загрузить на сервер
scp -r dist/* user@server:/var/www/address-form/

# Nginx конфиг
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/address-form;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### CI/CD Pipeline (GitHub Actions)

Создай `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_DADATA_TOKEN: ${{ secrets.DADATA_TOKEN }}
          VITE_WEBHOOK_URL: ${{ secrets.WEBHOOK_URL }}
        run: npm run build

      - name: Build Docker image
        run: |
          docker build \
            --build-arg VITE_DADATA_TOKEN=${{ secrets.DADATA_TOKEN }} \
            --build-arg VITE_WEBHOOK_URL=${{ secrets.WEBHOOK_URL }} \
            -t address-form:${{ github.sha }} .

      - name: Push to registry
        run: |
          docker push address-form:${{ github.sha }}
```

---

## ⚠️ Частые проблемы

### 1. "VITE_DADATA_TOKEN не настроен"

**Причина:** Не создан `.env` файл

**Решение:**
```bash
cp .env.example .env
nano .env  # добавить токен
```

### 2. Текст подсказок белый и не виден

**Причина:** react-dadata CSS не переопределен

**Решение:** В `AddressForm.css` добавить:
```css
.react-dadata__suggestions {
  color: #333333 !important;
}

.react-dadata__suggestion {
  color: #333333 !important;
}
```

### 3. Webhook не отвечает

**Причина:** CORS / Network / URL

**Решение:**
1. Проверь URL в `.env`
2. Проверь доступность webhook:
```bash
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```
3. Проверь CORS в N8N

### 4. Query параметры не читаются

**Причина:** useEffect не срабатывает

**Решение:** Проверь:
```typescript
// В AddressForm.tsx
const { user_id, session_id } = useQueryParams();
console.log('Params:', { user_id, session_id }); // Должны быть значения

// Проверь URL
window.location.search; // Должен содержать ?user_id=...
```

### 5. Build ошибка в Docker

**Причина:** Неправильные build args

**Решение:**
```bash
# Убедись что передаешь аргументы
docker build \
  --build-arg VITE_DADATA_TOKEN=token \
  --build-arg VITE_WEBHOOK_URL=url \
  -t address-form .

# Проверь в Dockerfile что они используются
ENV VITE_DADATA_TOKEN=$VITE_DADATA_TOKEN
```

### 6. TypeScript ошибки

**Причина:** Неправильные типы

**Решение:**
```bash
# Проверь типы
npm run build

# Или запусти tsc
npx tsc --noEmit
```

### 7. Медленная работа dev-сервера

**Причина:** Большой node_modules

**Решение:**
```bash
# Очисти кеш
rm -rf node_modules package-lock.json
npm install

# Или используй pnpm (быстрее)
npm i -g pnpm
pnpm install
```

---

## 📚 Полезные ссылки

### Документация технологий

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [DaData API](https://dadata.ru/api/)
- [react-dadata GitHub](https://github.com/vitalybaev/react-dadata)
- [Axios Docs](https://axios-http.com/docs/intro)

### Инструменты

- [webhook.site](https://webhook.site) - Тестовые webhook
- [JSONLint](https://jsonlint.com) - Валидация JSON
- [TypeScript Playground](https://www.typescriptlang.org/play)

---

## 🔄 Changelog

### Version 1.0.0 (2025-12-10)

**Features:**
- ✅ DaData автодополнение адресов
- ✅ Query параметры (user_id, session_id)
- ✅ Webhook интеграция
- ✅ Docker поддержка
- ✅ TypeScript типизация
- ✅ Responsive дизайн

**Fixed:**
- 🐛 Белый текст подсказок (добавлен color override)

---

## 📝 TODO для будущих версий

- [ ] Unit тесты (Jest + React Testing Library)
- [ ] E2E тесты (Playwright/Cypress)
- [ ] Валидация телефона (если добавишь поле)
- [ ] i18n поддержка (мультиязычность)
- [ ] Темная тема
- [ ] Analytics интеграция (Google Analytics / Yandex Metrika)
- [ ] Error boundary компонент
- [ ] Service Worker для offline режима
- [ ] Lighthouse оптимизация (100/100)

---

**Последнее обновление:** 2025-12-10

**Версия документации:** 1.0.0

**Авторы:** Development Team
