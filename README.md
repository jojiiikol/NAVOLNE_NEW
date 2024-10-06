# NAVOLNE

## 1.Запуск
### 1.1 Виртуальное окружение
`python -m venv .venv` -- Создание виртуального окружения
.\.venv\Script\activate -- Активация виртуального окружения
### 1.2 Установка зависимостей
`cd crowdfunding`

`pip install -r requirements.txt`
### 1.3 Настройка БД и миграции
В файле crowdfunding/crowdfunding/settings.py установить настройки вашей БД в DATABASES

`python manage.py makemigrations` -- Создать миграции

`python manage.py migrate` -- Провести миграции
### 1.4 Настройка суперюзера
`python manage.py createsuperuser`
### 1.5 Запуск
`python manage.py runserver`



