# NAVOLNE

## Запуск
### 1 Виртуальное окружение
`python -m venv .venv` -- Создание виртуального окружения
.\.venv\Script\activate -- Активация виртуального окружения
### 2 Установка зависимостей
`cd crowdfunding`

`pip install -r requirements.txt`
### 3 Настройка БД и миграции
В файле crowdfunding/crowdfunding/settings.py установить настройки вашей БД в DATABASES


`python manage.py migrate` -- Провести миграции
### 4 Настройка суперюзера
`python manage.py createsuperuser`
### 5 Запуск
`python manage.py runserver`



