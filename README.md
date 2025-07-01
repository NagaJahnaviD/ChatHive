# 🐝 ChatHive

**ChatHive** is a real-time chat application built using the **MERN stack** and **Socket.IO** for live communication. It features a visually rich UI powered by **Vanta.js** and secure user authentication using **Clerk** with Google login. Users can select contacts from a dynamic list of registered users and enjoy instant messaging.

---

## 🚀 Features

- 🔐 **Google Sign-In** with Clerk Authentication  
- 💬 **Real-Time Chat** using WebSockets (Socket.IO)  
- 🧠 **Smart Contacts System**  
  - View and select from your contact list  
  - Add new contacts from a dropdown list of all registered users  
- 🌈 **Interactive Background** using Vanta.js  
- 💻 Built with **MERN Stack**: MongoDB, Express.js, React.js, Node.js

---

## 🖼️ Preview

> *(Add screenshots or demo GIF here)*  
> Examples: Login screen, chat UI, contact selection dropdown

---

## 🛠️ Tech Stack

| Frontend      | Backend       | Realtime   | Auth     | Styling / Visuals |
|---------------|---------------|------------|----------|-------------------|
| React.js      | Node.js       | Socket.IO  | Clerk    | Vanta.js, CSS     |
| Tailwind CSS  | Express.js    |            | Google OAuth |               |
|               | MongoDB Atlas |            |          |                   |

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

git clone https://github.com/your-username/chathive.git
cd chathive

### 2. Install Dependencies
For both client and server:

Copy code
cd client
npm install
cd ../server
npm install

### 3. Setup Environment Variables
Create a .env file for both client and server with your credentials:

.env (server)
env
Copy code
PORT=5000
MONGO_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_backend_key
.env (client or .env.local)
env
Copy code
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_key
VITE_SOCKET_SERVER_URL=http://localhost:5000

### 4. Run the App
Start both client and server in separate terminals:

bash
Copy code
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev

## 🙌 Acknowledgments
Socket.IO

Vanta.js

Clerk.dev

MongoDB Atlas

## Authors:
Naga Jahanvi Dannayak
Radha Mayuri Devireddy

