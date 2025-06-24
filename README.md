# 💬 QuickChat – Chat App with Request Feature

![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen?logo=node.js)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?logo=socket.io)

QuickChat is a real-time chat application with a **chat request system**, **photo sharing**, **online/offline indicators**, and more. Users can connect by sending and accepting requests before chatting.

---

## 🚀 Features

- 🔐 JWT-based secure authentication
- 🧑‍🤝‍🧑 Chat request system (send / accept / reject)
- 💬 Real-time messaging with Socket.IO
- 📸 Image sharing (Cloudinary integration)
- 🟢 Online/offline user status
- 🔔 Unread message count
- 📱 Mobile-friendly responsive layout

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Realtime | Media Upload |
|----------|---------|----------|----------|--------------|
| React (Vite) | Node.js + Express | MongoDB | Socket.IO | Cloudinary |

---

## 📦 Environment Variables

### 🔒 Backend → `server/.env`

- MONGODB_URI=your_mongodb_uri
- PORT=5000
- JWT_SECRET=your_jwt_secret

- CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret

### 🌐 Frontend → client/.env

- VITE_BACKEND_URL=http://localhost:5000

---

## 🧑‍💻 Getting Started
### 1. Clone the Repository
- git clone https://github.com/your-username/CHATAPP.git
- cd CHATAPP

### 2. Backend Setup
- cd server
- npm install
- Add environment variables in .env
- npm run server

### 3. Frontend Setup
- cd ../client
- npm install
- Add environment variables in .env
- npm run dev

- Open your browser and go to: http://localhost:5173

---

## ⚠️ Important Notes
### Do NOT commit .env files to GitHub.
### Ensure your .gitignore includes:
- client/.env
- server/.env

### To permanently remove secrets committed earlier:
- git rm --cached server/.env
- git rm --cached client/.env
- echo "server/.env" >> .gitignore
- echo "client/.env" >> .gitignore
- git commit -m "Remove secrets from repo"
- git push origin master

---

## 🙋‍♂️ Author
### Made with ❤️ by Shyam Hirpara
