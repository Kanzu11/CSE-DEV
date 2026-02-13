# Knowledge AI Platform

A modern, full-stack AI-powered knowledge management and chat platform. This application leverages advanced RAG (Retrieval-Augmented Generation) techniques to allow users to upload documents and chat with them using state-of-the-art LLMs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61DAFB.svg)
![Node](https://img.shields.io/badge/backend-Node.js-339933.svg)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248.svg)

## 🚀 Features

-   **AI-Powered Chat**: Interact with your documents using Llama 3 via **Groq Cloud** for lightning-fast inference.
-   **Smart Embeddings**: High-quality document vectorization using **Voyage AI**.
-   **RAG Architecture**: Context-aware responses based on uploaded PDF documents.
-   **Secure Authentication**:
    -   Traditional Email/Password Login
    -   **Google OAuth 2.0** Integration
-   **Role-Based Access Control**:
    -   **Super Admin**: Manage platform admins and system settings.
    -   **Admin**: Upload and manage knowledge base documents.
    -   **User**: Chat with the AI and view history.
-   **Modern UI/UX**: Built with **React**, **Tailwind CSS**, and **Framer Motion** for smooth animations.

---

## 🛠️ Tech Stack

### Frontend
-   **React** (Vite)
-   **Tailwind CSS** (Styling)
-   **Framer Motion & GSAP** (Animations)
-   **Lucide React** (Icons)
-   **Axios** (API Client)
-   **React Router** (Navigation)

### Backend
-   **Node.js & Express**
-   **MongoDB & Mongoose** (Database)
-   **Passport.js** (Google OAuth Strategy)
-   **JWT** (JSON Web Tokens)
-   **PDF-Parse** (Document Processing)

### AI Infrastructure
-   **LLM Provider**: [Groq Cloud](https://groq.com/) (Llama-3.3-70b-versatile)
-   **Embedding Provider**: [Voyage AI](https://voyageai.com/) (voyage-2)

---

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Running locally or Atlas URI)
-   API Keys for **Voyage AI** and **Groq Cloud**
-   Google Cloud Console Project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/kanzu1/csec-dev.git
cd csec-dev
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/knowledge-ai
JWT_SECRET=your_super_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Providers
VOYAGE_API_KEY=your_voyage_api_key
VOYAGE_MODEL=voyage-2

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

---

## 🔑 Environment Variables Guide

| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console |
| `VOYAGE_API_KEY` | API Key from Voyage AI for embeddings |
| `GROQ_API_KEY` | API Key from Groq Cloud for LLM inference |

---

## 📖 Usage

1.  **Sign Up/Login**: Create an account or sign in with Google.
2.  **Admin Panel**: If you are an admin, navigate to the dashboard to upload PDF documents.
3.  **Chat**: Go to the chat interface. The AI will now answer questions based on the content of the uploaded PDFs.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## ⚙️ How It Works

### System Architecture
The platform is built on a **Retrieval-Augmented Generation (RAG)** architecture, which combines the power of large language models with your custom data.

1.  **Document Ingestion**:
    -   Admins upload PDF documents via the secure dashboard.
    -   The backend uses `pdf-parse` to extract raw text from these files.

2.  **Vectorization (Embeddings)**:
    -   The extracted text is split into manageable chunks.
    -   These chunks are sent to **Voyage AI**, which converts them into high-dimensional vector embeddings.
    -   The embeddings are stored in MongoDB along with the text content for efficient retrieval.

3.  **The Chat Loop**:
    -   **User Query**: A user asks a question in the chat interface.
    -   **Semantic Search**: The system converts the user's question into a vector using Voyage AI and searches MongoDB for the most similar document chunks (Cosine Similarity).
    -   **Context Construction**: The most relevant chunks are retrieved and formatted as "context".
    -   **AI Generation**: The context and the user's question are sent to **Groq Cloud (Llama 3)**.
    -   **Response**: The LLM generates an accurate answer based *only* on the provided context, minimizing hallucinations.

### User Roles & Permissions
-   **Super Admin**: Has full system control. Can promote users to Admin or Super Admin roles.
-   **Admin**: Can manage the knowledge base (upload/delete documents).
-   **User**: Can access the chat interface to query the knowledge base and view their personal chat history.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
