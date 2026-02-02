# ✈️ AAI Survey System – Frontend

A web-based **Survey & Feedback Management System** UI developed as part of my **internship at Airport Authority of India (AAI)**.  
This project focuses on building a **clean, professional, and scalable frontend** using **React** with a government-portal style UI.

---

## 📌 Project Overview

The **AAI Survey System** is designed to:
- Allow agents to **register** themselves
- Provide a **login interface** for users
- Collect feedback and survey data (future scope)
- Maintain a consistent **AAI-branded UI** with watermark background

This repository currently contains the **authentication module (Login & Registration)** and will be extended with backend integration, dashboards, and reporting features.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Routing:** React Router DOM
- **Styling:** CSS (custom, module-based)
- **Assets:** SVG / PNG (AAI logo & icons)

---

## 📂 Project Structure

src/
├── assets/
│ └── (logos, icons)
| └── Airports_Authority_of_India_logo.svg.png
│
├── modules/
│ └── auth/
│ ├── components/
│ │ ├── LoginForm.jsx
│ │ └── RegisterForm.jsx
│ │
│ ├── pages/
│ │ ├── LoginPage.jsx
│ │ └── RegisterPage.jsx
│ │
│ └── auth.css
│
├── App.jsx
├── main.jsx
├── index.css
│
public/
└── aai-logo.svg
└── user-avtar.svg



---

## ✨ Features Implemented (Till Now)

### ✅ Login Page
- Full-screen responsive layout
- AAI logo in header (left aligned)
- Centered login form
- Custom user avatar icon
- “Register?” navigation link
- AAI watermark background

### ✅ Agent Registration Page
- Agent registration form with:
  - Full Name
  - Email
  - Mobile Number
  - Company Name
  - Upload ID
  - Airport Selection
- Consistent UI with login page
- Dark blue AAI-style register button

### ✅ Routing
- Client-side routing using **React Router**
- `/` → Login Page
- `/register` → Agent Registration Page

---

## 🚀 How to Run the Project

1. Clone the repository:
   ```bash
   git clone <repository-url>

2. Navigate to project folder:
    cd aai-survey-system
   
3. Install dependencies:
    npm install

4. Start development server:
    npm run dev
   
5. Open in browser:
    http://localhost:5173


👨‍💻 Author

Talib Hussain
Frontend Developer Intern – Airport Authority of India (AAI)

📄 Note

This project is being actively developed.
New features and modules will be added continuously as part of the internship work.
