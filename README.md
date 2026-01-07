# DevHub - Платформа для IT-портфоліо

**DevHub** — це сучасна веб-платформа для розробників, яка дозволяє створювати персональні портфоліо, ділитися проєктами та досліджувати роботи інших учасників спільноти.

---

## Зміст

- [Огляд проекту](#-огляд-проекту)
- [Основні функції](#-основні-функції)
- [Технологічний стек](#-технологічний-стек)
- [Архітектура проекту](#-архітектура-проекту)
- [Встановлення та налаштування](#-встановлення-та-налаштування)
- [Використання](#-використання)
- [API документація](#-api-документація)
- [Структура бази даних](#-структура-бази-даних)
- [Скріншоти](#-скріншоти)
- [Автор](#-автор)

---

## Огляд проекту

DevHub — це fullstack веб-додаток, створений для курсової роботи, який надає розробникам простий спосіб:
- Створювати та управляти власним портфоліо
- Демонструвати свої проєкти з детальними описами
- Завантажувати резюме та фото профілю
- Досліджувати проєкти інших розробників
- Відстежувати перегляди проєктів

---

## Основні функції

### Для користувачів
- **Автентифікація та авторизація** — реєстрація, вхід через JWT токени
- **Управління профілем** — завантаження фото профілю, резюме (PDF), додавання біографії
- **Соціальні посилання** — інтеграція GitHub та LinkedIn
- **Публічний профіль** — персональна сторінка з усіма проєктами та інформацією

### Управління проєктами
- **Створення проєктів** — додавання назви, опису, зображень
- **Посилання** — GitHub репозиторії та live демо
- **Технології** — теги для використаних технологій
- **Статистика** — підрахунок переглядів проєктів
- **Редагування та видалення** — повний контроль над своїми проєктами

### Додаткові можливості
- **Пошук проєктів** — знаходження проєктів за назвою або описом
- **Пагінація** — зручна навігація по великій кількості проєктів
- **Пошук користувачів** — знаходження інших розробників
- **Досвід роботи** — додавання інформації про попередні місця роботи
- **Освіта** — відображення навчальних закладів та ступенів

---

## Технологічний стек

### Frontend
- **React 19.2** — сучасна бібліотека для побудови UI
- **React Router DOM 7.11** — маршрутизація
- **Axios** — HTTP клієнт для API запитів
- **Vite** — швидкий інструмент збірки
- **Lucide React** — іконки
- **CSS3** — стилізація з кастомними властивостями

### Backend
- **Django 5.2** — потужний Python веб-фреймворк
- **Django REST Framework** — створення RESTful API
- **PostgreSQL** — реляційна база даних
- **Simple JWT** — JWT автентифікація
- **drf-spectacular** — автоматична генерація OpenAPI документації
- **Pillow** — обробка зображень
- **django-cors-headers** — підтримка CORS

### Інструменти розробки
- **ESLint** — лінтинг JavaScript коду
- **Git** — контроль версій

---

## Архітектура проекту

```
portfolio_project/
├── backend/                    # Django backend
│   ├── config/                # Налаштування проекту
│   │   ├── settings.py       # Конфігурація Django
│   │   ├── urls.py           # Головні URL маршрути
│   │   └── api_router.py     # API роутер
│   ├── users/                # Додаток користувачів
│   │   ├── models.py         # UserProfile модель
│   │   ├── serializers.py    # API серіалізатори
│   │   ├── views.py          # API views
│   │   └── urls.py           # URL маршрути
│   ├── portfolio/            # Додаток портфоліо
│   │   ├── models.py         # Project, Technology, Experience, Education
│   │   ├── serializers.py    # API серіалізатори
│   │   └── views.py          # API views
│   ├── media/                # Завантажені файли
│   │   ├── profile_pics/     # Фото профілів
│   │   ├── resumes/          # Резюме користувачів
│   │   └── project_images/   # Зображення проєктів
│   ├── manage.py             # Django CLI
│   └── requirements.txt      # Python залежності
│
└── portfolio-frontend/        # React frontend
    ├── src/
    │   ├── components/       # React компоненти
    │   │   ├── Navbar.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── ProjectModal.jsx
    │   │   ├── MyProjects.jsx
    │   │   ├── Settings.jsx
    │   │   └── UserSearch.jsx
    │   ├── pages/            # Сторінки
    │   │   ├── Home.jsx
    │   │   ├── Explore.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── PublicProfile.jsx
    │   ├── context/          # React Context
    │   │   └── AuthContext.jsx
    │   ├── api/              # API клієнт
    │   ├── App.jsx           # Головний компонент
    │   └── main.jsx          # Точка входу
    ├── public/               # Статичні файли
    ├── package.json          # NPM залежності
    └── vite.config.js        # Vite конфігурація
```

---

## Встановлення та налаштування

### Передумови
- **Python 3.10+**
- **Node.js 18+** та **npm**
- **PostgreSQL 14+**
- **Git**

### 1. Клонування репозиторію

```bash
git clone https://github.com/yourusername/portfolio_project.git
cd portfolio_project
```

### 2. Налаштування бази даних

Створіть PostgreSQL базу даних:

```sql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'admin';
ALTER ROLE portfolio_user SET client_encoding TO 'utf8';
ALTER ROLE portfolio_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE portfolio_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

### 3. Налаштування Backend

```bash
cd backend

# Створення віртуального середовища
python -m venv venv

# Активація віртуального середовища
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Встановлення залежностей
pip install -r requirements.txt

# Виконання міграцій
python manage.py migrate

# Створення суперкористувача (опціонально)
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver
```

Backend буде доступний за адресою: `http://127.0.0.1:8000`

### 4. Налаштування Frontend

Відкрийте новий термінал:

```bash
cd portfolio-frontend

# Встановлення залежностей
npm install

# Запуск dev сервера
npm run dev
```

Frontend буде доступний за адресою: `http://localhost:5173`

---

## Використання

### Реєстрація та вхід
1. Відкрийте `http://localhost:5173`
2. Натисніть "Реєстрація" та створіть обліковий запис
3. Увійдіть з вашими обліковими даними

### Створення портфоліо
1. Перейдіть до **Dashboard**
2. Натисніть **"Налаштування"** для редагування профілю:
   - Завантажте фото профілю
   - Додайте біографію
   - Завантажте резюме (PDF)
   - Додайте посилання на GitHub та LinkedIn
3. Перейдіть до **"Мої проєкти"** для додавання проєктів:
   - Заповніть назву та опис
   - Завантажте зображення
   - Додайте посилання на GitHub та live demo
   - Виберіть технології

### Перегляд проєктів
1. Перейдіть до розділу **"Досліджувати"**
2. Використовуйте пошук для фільтрації проєктів
3. Натисніть на проєкт для детального перегляду
4. Відвідайте профіль автора, натиснувши на його ім'я



## API документація

### Swagger UI
Інтерактивна API документація доступна за адресою:
```
http://127.0.0.1:8000/api/v1/swagger/
```

### ReDoc
Альтернативна документація:
```
http://127.0.0.1:8000/api/v1/redoc/
```

### Основні ендпоінти

#### Автентифікація
- `POST /api/v1/token/` — отримання JWT токенів
- `POST /api/v1/token/refresh/` — оновлення access токена
- `POST /api/v1/register/` — реєстрація нового користувача

#### Користувачі
- `GET /api/v1/users/` — список користувачів (пошук)
- `GET /api/v1/users/{username}/` — профіль користувача
- `GET /api/v1/profile/` — поточний профіль (авторизований)
- `PUT /api/v1/profile/` — оновлення профілю
- `PATCH /api/v1/profile/` — часткове оновлення профілю

#### Проєкти
- `GET /api/v1/projects/` — список всіх проєктів (з пошуком)
- `POST /api/v1/projects/` — створення проєкту
- `GET /api/v1/projects/{id}/` — деталі проєкту
- `PUT /api/v1/projects/{id}/` — оновлення проєкту
- `DELETE /api/v1/projects/{id}/` — видалення проєкту
- `GET /api/v1/my-projects/` — проєкти поточного користувача

#### Технології
- `GET /api/v1/technologies/` — список технологій
- `POST /api/v1/technologies/` — створення технології

#### Досвід роботи
- `GET /api/v1/experience/` — список досвіду
- `POST /api/v1/experience/` — додавання досвіду
- `PUT /api/v1/experience/{id}/` — оновлення
- `DELETE /api/v1/experience/{id}/` — видалення

#### Освіта
- `GET /api/v1/education/` — список освіти
- `POST /api/v1/education/` — додавання освіти
- `PUT /api/v1/education/{id}/` — оновлення
- `DELETE /api/v1/education/{id}/` — видалення

### Приклад запиту

```bash
# Отримання токена
curl -X POST http://127.0.0.1:8000/api/v1/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'

# Створення проєкту
curl -X POST http://127.0.0.1:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Мій проєкт",
    "description": "Опис проєкту",
    "github_link": "https://github.com/user/repo"
  }'
```

---

## Структура бази даних

### Основні моделі

#### UserProfile
- `user` — зв'язок з Django User (OneToOne)
- `bio` — біографія користувача
- `profile_picture` — фото профілю
- `resume_cv` — резюме (PDF)
- `github_url` — посилання на GitHub
- `linkedin_url` — посилання на LinkedIn

#### Project
- `profile` — автор проєкту (ForeignKey)
- `title` — назва проєкту
- `description` — опис
- `image` — зображення проєкту
- `github_link` — посилання на репозиторій
- `live_link` — посилання на live версію
- `technologies` — використані технології (ManyToMany)
- `views` — кількість переглядів
- `created_at` — дата створення

#### Technology
- `name` — назва технології (унікальна)

#### Experience
- `profile` — профіль користувача (ForeignKey)
- `company` — назва компанії
- `role` — посада
- `start_date` — дата початку
- `end_date` — дата закінчення (опціонально)
- `description` — опис обов'язків

### Діаграма зв'язків

```
User (Django) ──1:1── UserProfile
                         │
                         ├──1:N── Project ──N:M── Technology
                         │
                         ├──1:N── Experience
                         
```

---

## Скріншоти

### Головна сторінка
Привітальна сторінка з описом платформи

### Сторінка "Досліджувати"
Перегляд всіх проєктів з можливістю пошуку та фільтрації

### Dashboard
Особистий кабінет користувача з управлінням проєктами та налаштуваннями

### Публічний профіль
Персональна сторінка користувача з портфоліо, досвідом та освітою

---

## Налаштування для продакшну

### Backend
1. Змініть `DEBUG = False` в `settings.py`
2. Встановіть `SECRET_KEY` через змінні середовища
3. Налаштуйте `ALLOWED_HOSTS`
4. Використовуйте gunicorn або uWSGI
5. Налаштуйте nginx для статичних файлів
6. Використовуйте PostgreSQL в продакшні

### Frontend
```bash
npm run build
```
Розгорніть файли з папки `dist/` на статичному хостингу або CDN

---

## Внесок у проект

Якщо ви хочете внести свій внесок:
1. Зробіть Fork репозиторію
2. Створіть гілку для нової функції (`git checkout -b feature/AmazingFeature`)
3. Зробіть commit змін (`git commit -m 'Add some AmazingFeature'`)
4. Відправте зміни в гілку (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

---

## Ліцензія

Цей проект створений для навчальних цілей як курсова робота.

---

##  Автор

**Стащишин Юрій**
- GitHub: (https://github.com/Float36)


**Зроблено для курсової роботи**
