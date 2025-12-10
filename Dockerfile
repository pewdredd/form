# Стадия 1: Сборка приложения
FROM node:18-alpine as build

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Аргументы для build-time переменных окружения
ARG VITE_DADATA_TOKEN
ARG VITE_WEBHOOK_URL

# Устанавливаем переменные окружения для сборки
ENV VITE_DADATA_TOKEN=$VITE_DADATA_TOKEN
ENV VITE_WEBHOOK_URL=$VITE_WEBHOOK_URL

# Собираем приложение
RUN npm run build

# Стадия 2: Production образ с nginx
FROM nginx:alpine

# Копируем собранное приложение из стадии build
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем nginx конфигурацию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
