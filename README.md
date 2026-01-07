# 📝 Task Management Application (Real-Time)

A full-stack **Task Management Application** designed to manage tasks efficiently with **real-time synchronization** across clients.  
This project is built following **industry-level folder structure**, clean separation of concerns, and modern frontend & backend practices.

The application demonstrates real-world concepts such as:
- WebSocket-based real-time updates
- Scalable frontend architecture
- Backend API + database integration
- Environment-based configuration
- Mobile-first responsive UI

---

## 🎯 Project Objective

The main goal of this project is to build a **real-time task management system** where:
- Users can create and view tasks
- Task updates are reflected instantly without page refresh
- Frontend and backend communicate using WebSockets
- The UI works smoothly across all screen sizes

This project was developed as part of an **interview/assessment task** to demonstrate full-stack development skills.

---

## ✨ Key Features

- 🆕 Create new tasks in real time
- 🔄 Instant task updates using **Socket.IO**
- 📡 Persistent backend API with database support
- 📱 Fully responsive UI (mobile, tablet, desktop)
- ⚡ Fast development experience using **Vite**
- 🧱 Clean and maintainable code structure
- 🔐 Secure configuration using `.env` files

---

## 🛠️ Tech Stack Used

### 🔹 Frontend
- **React** (TypeScript)
- **Vite** (for fast builds and HMR)
- **Socket.IO Client**
- Modern component-based architecture

### 🔹 Backend
- **Node.js**
- **Express.js**
- **Socket.IO**
- **PostgreSQL**
- **dotenv** for environment variables

---

## 📁 Folder Structure Explained
TASK_MANAGEMENT/
│
├── frontend/ # Frontend application
│ ├── src/
│ │ ├── App.tsx # Root React component
│ │ ├── index.tsx # React entry point
│ │
│ ├── components/ # Reusable UI components
│ ├── services/ # API & WebSocket logic
│ ├── types/ # TypeScript types & interfaces
│ │
│ ├── index.html # Vite HTML entry
│ ├── package.json # Frontend dependencies
│ ├── tsconfig.json
│ └── vite.config.ts
│
├── backend/ # Backend application
│ ├── src/ # Controllers, routes, sockets
│ ├── index.js # Backend entry point
│ ├── package.json # Backend dependencies
│ └── .env # Backend environment variables
│
├── .env.example # Sample environment config
├── package.json # Root scripts (concurrently)
└── README.md

---

## ⚙️ Environment Variables

Environment variables are used to keep secrets and configuration secure.

### Frontend (`frontend/.env`)VITE_API_URL=http://localhost:5000

VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

You can also start both frontend and backend together using:

npm start

Real-Time Communication (WebSockets)

This project uses Socket.IO to handle real-time features.

How it works:

    1.Backend emits events when tasks are created/updated
    
    2.Frontend listens to socket events
    
    3.UI updates instantly without refresh
    
    4.This approach improves:
    
          Performance
          
          User experience
          
          Scalability


Responsive Design

    1.The UI is built with a mobile-first approach:
    
    2.Works on phones, tablets, and desktops
    
    3.Flexible layouts
    
    4.Clean spacing and readable typography

Future Enhancements

    1.OAuth authentication (Google / GitHub)
    
    2.User-specific task ownership
    
    3.Role-based access control
    
    4.Task status filters & analytics
    
    5.Docker-based deployment
    
    6.Cloud hosting
