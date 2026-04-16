# 🐞 Bug Tracker (Full Stack Application)

A production-style bug tracking system built with **ASP.NET Core Web API** and **React (TypeScript)**.

This project demonstrates real-world application architecture, including authentication, modular frontend structure, and scalable API design.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication (Register & Login)
- Protected endpoints for secure operations

### 🧩 Issue Management
- Create, edit, delete issues
- View issue details (modal)
- Filter by status and priority
- Search by title/description
- Pagination with metadata

### 📁 Project Management
- Create and list projects
- Project details page (/projects/:id)
- View issues per project
- Dynamic issue count per project

### 🧭 Application Structure
- Multi-page architecture:
  - /dashboard → overview
  - /issues → issue management
  - /projects → project management
  - /projects/:id → project details
- Shared layout with sidebar navigation
- Reusable components (modals, buttons, layout)

---

## 🛠️ Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger (API testing)

### Frontend
- React (Vite + TypeScript)
- Tailwind CSS
- React Router
- Fetch API (service-based architecture)

---

## 🧱 Architecture

### Backend
- Controllers → API endpoints
- Services → business logic
- DTOs → data shaping
- Models → database entities

### Frontend
- Pages → route-based views
- Components → reusable UI
- Services → API calls (centralized)
- Layout → shared UI structure

---

## 📊 Key Improvements (Recent)

- Refactored app into multi-route structure
- Introduced Layout with sidebar navigation
- Separated Issues and Projects into dedicated pages
- Implemented Project Details page with dynamic issue loading
- Centralized API logic using service layer
- Improved UI hierarchy and user experience

---

## ⚙️ Setup

### Backend

bash
git clone https://github.com/YuniorAlex2/BugTracker.API
cd BugTracker.API
dotnet ef database update
dotnet run

Frontend
cd bugtracker-ui
npm install
npm run dev

🔗 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login

Issues
GET /api/issues
POST /api/issues
PUT /api/issues/{id}
DELETE /api/issues/{id}

Projects
GET /api/projects
GET /api/projects/{id}
GET /api/projects/{id}/issues
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}

🎯 Purpose

This project was built to demonstrate:

Real-world backend architecture
Clean frontend structure with routing
Full CRUD workflows
Integration between frontend and backend
Scalable application design

📌 Next Steps
Edit/Delete project
Create issue from project page
Improve dashboard analytics
Deployment (frontend + backend)

## 🚧 Latest Updates

- Implemented full **Project CRUD (Create, Edit, Delete)**
- Added **Project Details page** with dynamic issue loading
- Refactored frontend into a **multi-page architecture**
- Introduced **Layout with sidebar navigation**
- Centralized API calls using service layer (clean separation of concerns)
- Implemented **JWT Authentication flow (Register & Login)**
- Added **protected routes** with authentication guard
- Improved UI consistency across Issues and Projects modules

This project now reflects a real-world full stack application structure, including authentication, routing, and scalable data flow between frontend and backend.

👨‍💻 Author
Alex Suero
