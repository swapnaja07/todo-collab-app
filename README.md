# 🚀 Todo Collab App

![React](https://img.shields.io/badge/Frontend-React-blue)
![Django](https://img.shields.io/badge/Backend-Django-green)
![DRF](https://img.shields.io/badge/API-Django%20REST-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

A **Trello-like collaborative task management app** built using React and Django REST Framework.

---

## ✨ Features

* 🗂️ Create multiple boards (lists)
* ✅ Add, edit, update, delete tasks
* 🔄 Drag & drop tasks across columns
* 👥 Share lists with other users
* 🔐 JWT Authentication
* 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* @hello-pangea/dnd

### Backend

* Django
* Django REST Framework
* SQLite
* JWT Authentication

---

## 📂 Project Setup

### 🔧 Backend Setup

```bash
git clone https://github.com/your-username/todo-collab-app.git
cd todo-collab-app/backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py runserver
```

---

### 🎨 Frontend Setup

```bash
cd frontend

npm install
npm install axios @hello-pangea/dnd react-icons

npm start
```

---

## 🧠 Application Flow

Create List → Select List → Create Task → Drag & Drop → Share List

---

## 🏗️ Architecture

React (Frontend)
↓
Axios API Calls
↓
Django REST API
↓
Database (SQLite)

---

## 🖼️ Architecture Diagram
<img width="1024" height="1536" alt="architecture" src="https://github.com/user-attachments/assets/97f62dc5-7461-4a02-bc31-4fa8b02bfe56" />


---

## ⚠️ Common Issues

### ❌ 403 Forbidden

* Ensure JWT token is sent in headers

### ❌ Network Error

* Backend not running
* Incorrect API URL

### ❌ list_id is null

* Select a list before creating tasks or sharing

---

## 🚀 Future Improvements

* 🔔 Notifications
* ⚡ Real-time updates (WebSockets)
* 👥 Role-based access (Viewer/Editor)
* 🎨 Enhanced UI/UX

---

## 👩‍💻 Author

**Swapnaja Singh**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
