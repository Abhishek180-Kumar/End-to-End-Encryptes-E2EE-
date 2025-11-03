 🛡️ SecureChat – End-to-End Encrypted Real-Time Chat App

> A modern, privacy-focused real-time chat application built with **End-to-End Encryption (E2EE)** to ensure your conversations remain secure and private.  
> Built using **ReactJS, Node.js, Express, MongoDB, and Socket.IO**.

---

## 🔐 Overview

**SecureChat** is a full-stack web application that allows users to send and receive encrypted messages in real-time.  
Messages are **encrypted on the sender’s device** and **decrypted only by the intended recipient**, ensuring **zero server access to plaintext data**.

The app demonstrates a combination of **cryptography, secure communication, and web development**, making it ideal for privacy-driven users and security enthusiasts.

---

## ✨ Features

✅ **End-to-End Encryption (E2EE)** – Messages are encrypted before sending and decrypted only by the receiver.  
✅ **Real-Time Messaging** – Instant chat using Socket.IO.  
✅ **Secure Key Exchange** – Implements Diffie-Hellman or RSA for secure key generation and sharing.  
✅ **User Authentication** – JWT (JSON Web Token)-based secure authentication.  
✅ **Encrypted Database Storage** – Messages remain encrypted even in MongoDB.  
✅ **Responsive Design** – Built with React + TailwindCSS for a sleek, mobile-friendly interface.  
✅ **Scalable Architecture** – Modular and clean codebase for easy extension.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Encrypted Storage) |
| **Communication** | Socket.IO |
| **Encryption** | AES / RSA + Diffie-Hellman Key Exchange |
| **Authentication** | JWT (JSON Web Token) |
| **Tools** | VS Code, Postman, Git, GitHub |

---

## ⚙️ Project Structure

SecureChat/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI components (ChatBox, Login, Register, etc.)
│ │ ├── utils/ # Encryption helpers
│ │ ├── pages/ # Page components
│ │ └── App.js
│ ├── package.json
│
├── server/ # Node.js backend
│ ├── models/ # MongoDB schemas
│ ├── routes/ # Auth & chat APIs
│ ├── utils/ # Encryption, JWT verification
│ ├── server.js # Entry point (Socket.IO + Express)
│ ├── config/ # Database and env setup
│ └── package.json
│
├── .env # Environment variables
├── README.md # Project documentation
└── LICENSE # License file

yaml
Copy code

---

## 🚀 Installation & Setup

### 🖥️ Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- Git
- VS Code

### 🔧 Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SecureChat-E2EE.git
   cd SecureChat-E2EE
Install dependencies

bash
Copy code
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
Setup environment variables

Create a .env file in the server/ directory and add:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Run the backend

bash
Copy code
cd server
npm start
Run the frontend

bash
Copy code
cd ../client
npm start
Open in browser

arduino
Copy code
http://localhost:3000
🔑 Encryption Workflow
Key Generation:
Each user generates a public-private key pair (RSA/DH).

Key Exchange:
On chat initiation, users exchange public keys.

Message Encryption:
Messages are encrypted with the recipient’s public key and sent to the server.

Message Transmission:
The server forwards the encrypted message (it cannot decrypt).

Message Decryption:
The recipient’s client decrypts it using their private key.

🧠 Learning Objectives
Implementing End-to-End Encryption in real-world chat systems

Understanding Diffie-Hellman Key Exchange and RSA encryption

Building secure authentication and authorization with JWT

Using Socket.IO for real-time communication

Managing encrypted data storage with MongoDB

🌍 Real-World Use Cases
Private corporate communication tools

Healthcare or legal confidential chats

Secure peer-to-peer messaging platforms

Data-sensitive communication for journalists or researchers

🚧 Future Enhancements
📱 Encrypted group chats

📞 Encrypted voice and video calls

🔒 Two-Factor Authentication (2FA)

🕒 Message expiration & self-destruct

☁️ Encrypted cloud message backups

🤝 Contributing
Contributions are welcome!
Feel free to fork this repo, open an issue, or submit a pull request.

🧾 License
This project is licensed under the MIT License – see the LICENSE file for details.

💬 Author
Abhishek Kumar
🚀 Computer Science Engineer | AI, ML & IoT Enthusiast
📧 [your.email@example.com]
🔗 LinkedIn Profile

