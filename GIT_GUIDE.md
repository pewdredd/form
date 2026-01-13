# 📚 Git - Руководство по работе

Краткое руководство по основным командам Git для работы с проектом.

---

## 🚀 Базовый процесс заливки изменений на GitHub

```bash
# 1. Посмотреть, какие файлы изменены
git status

# 2. Добавить изменённый файл в staging (подготовка к коммиту)
git add src/components/StepByStepAddressForm.tsx

# Или добавить все изменённые файлы сразу:
git add .

# 3. Создать коммит с описанием изменений
git commit -m "Добавлено ограничение выбора только СПб и ЛО"

# 4. Залить изменения на GitHub
git push origin main
```

---

## 📋 Просмотр изменений

```bash
# Посмотреть статус (какие файлы изменены)
git status

# Посмотреть изменения в файлах (до добавления в staging)
git diff

# Посмотреть изменения в конкретном файле
git diff src/components/StepByStepAddressForm.tsx

# Посмотреть изменения в файлах (после git add)
git diff --staged
```

---

## 📜 История коммитов

```bash
# Посмотреть историю коммитов (полный формат)
git log

# Посмотреть историю коммитов (короткий формат)
git log --oneline

# Посмотреть последние 5 коммитов
git log --oneline -5

# Посмотреть коммиты с изменениями в файлах
git log --stat

# Посмотреть коммиты конкретного файла
git log src/components/StepByStepAddressForm.tsx
```

---

## ↩️ Отмена изменений

```bash
# Отменить изменения в файле (до git add)
git restore src/components/StepByStepAddressForm.tsx

# Отменить изменения во всех файлах (до git add)
git restore .

# Убрать файл из staging (отменить git add, но оставить изменения)
git restore --staged src/components/StepByStepAddressForm.tsx

# Убрать все файлы из staging
git restore --staged .
```

---

## 🌿 Работа с ветками

```bash
# Посмотреть список веток
git branch

# Создать новую ветку
git branch feature/new-feature

# Переключиться на другую ветку
git checkout feature/new-feature

# Создать новую ветку и сразу переключиться на неё
git checkout -b feature/new-feature

# Удалить ветку (локально)
git branch -d feature/new-feature

# Залить ветку на GitHub
git push origin feature/new-feature
```

---

## 🔄 Синхронизация с GitHub

```bash
# Получить изменения с GitHub (без применения)
git fetch origin

# Получить изменения с GitHub и применить их
git pull origin main

# Залить локальные изменения на GitHub
git push origin main

# Залить новую ветку на GitHub
git push -u origin feature/new-feature
```

---

## 🔍 Информация о репозитории

```bash
# Проверить настройки удалённого репозитория
git remote -v

# Посмотреть конфигурацию git
git config --list

# Проверить SSH подключение к GitHub
ssh -T git@github.com

# Посмотреть имя текущей ветки
git branch --show-current
```

---

## 📝 Полезные команды

```bash
# Показать последний коммит
git show

# Показать конкретный коммит
git show 9f7daef

# Найти коммиты по тексту сообщения
git log --grep="СПб"

# Найти коммиты, которые изменили определённый текст в файлах
git log -S "filterLocations"

# Посмотреть кто и когда менял строки в файле
git blame src/components/StepByStepAddressForm.tsx
```

---

## 🎯 Пример: Полный workflow для этого проекта

### 1. Внести изменения в код
```bash
# Редактируй файлы в IDE/редакторе
code src/components/StepByStepAddressForm.tsx
```

### 2. Проверить изменения
```bash
git status
git diff src/components/StepByStepAddressForm.tsx
```

### 3. Добавить в staging
```bash
git add src/components/StepByStepAddressForm.tsx
```

### 4. Создать коммит
```bash
git commit -m "Описание изменений"
```

**Примеры хороших сообщений коммитов:**
- `git commit -m "Добавлено ограничение выбора городов только СПб и ЛО"`
- `git commit -m "Fix: Исправлена валидация поля квартира"`
- `git commit -m "Обновлены стили формы адреса"`
- `git commit -m "Добавлено поле для комментария курьера"`

### 5. Залить на GitHub
```bash
git push origin main
```

---

## ⚠️ Важные моменты

### Перед коммитом всегда проверяй:
- ✅ `git status` - что именно ты коммитишь
- ✅ `git diff` - какие изменения в файлах
- ✅ Напиши понятное сообщение коммита
- ✅ Не коммить `.env` файлы с секретами

### Если что-то пошло не так:
```bash
# Отменить последний коммит (но оставить изменения)
git reset --soft HEAD~1

# Изменить сообщение последнего коммита
git commit --amend -m "Новое сообщение"

# ОСТОРОЖНО: Полностью откатить последний коммит (удалит изменения!)
git reset --hard HEAD~1
```

---

## 🔗 Полезные ссылки

- [Git документация (русская)](https://git-scm.com/book/ru/v2)
- [GitHub документация](https://docs.github.com/ru)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Интерактивное обучение Git](https://learngitbranching.js.org/?locale=ru_RU)

---

## 💡 Советы

1. **Делай коммиты часто** - маленькие коммиты лучше, чем один большой
2. **Пиши понятные сообщения** - через месяц ты забудешь, что делал
3. **Проверяй перед push** - `git log --oneline` покажет, что ты отправляешь
4. **Используй ветки** - для новых фич создавай отдельные ветки
5. **Синхронизируйся часто** - делай `git pull` перед началом работы

---

**Создано для проекта Address Form - Vodovoz**
