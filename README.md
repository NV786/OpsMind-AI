# 🧠 OpsMind AI

> **Talk to your documents.** An intelligent RAG-based Chatbot that reads PDFs and answers questions with precise page citations.

![OpsMind Banner](https://via.placeholder.com/1200x300?text=OpsMind+AI+-+Intelligent+Document+Analysis)
## 🚀 Overview

**OpsMind AI** is a full-stack application designed to process complex PDF documents and allow users to query them using natural language. Unlike standard chatbots, OpsMind uses a **Retrieval-Augmented Generation (RAG)** pipeline to fetch the exact source text and provides the **Filename and Page Number** for every answer.

---

## ✨ Key Features

- **📄 Smart PDF Parsing:** Extracts text while preserving page numbers for accurate referencing.
- **🤖 RAG Pipeline:** Context-aware answers using **Google Gemini 1.5 Flash**.
- **🔍 Vector Search:** Semantic search capabilities powered by **MongoDB Atlas**.
- **⚡ Asynchronous Processing:** Uses a dedicated Worker Queue (**BullMQ**) to handle large files in the background.
- **📍 Precise Citations:** Every answer includes the exact source: e.g., *Ques.pdf (Page No. : 1)*.
- **🛡️ Scalable Architecture:** Decoupled Backend, Frontend, and Worker services.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js (Vite)** - Fast, modern UI library.
- **Tailwind CSS** - Utility-first styling for a clean design.
- **Axios** - For API communication.

### **Backend**
- **Node.js & Express** - REST API server.
- **LangChain** - Orchestration framework for LLM workflows.
- **Google Generative AI** - LLM Model (Gemini 2.5 Flash).
- **BullMQ & Redis** - Message queue for background job processing.
- **Multer** - For handling file uploads.

### **Database**
- **MongoDB Atlas** - Primary database and Vector Store.

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [Redis](https://redis.io/) (Required for the background worker)
- A MongoDB Atlas Account with Vector Search enabled.

### 2. Clone the Repository
```bash
git clone [https://github.com/NV786/OpsMind-AI.git](https://github.com/NV786/OpsMind-AI.git)
cd OpsMind-AI
```

### 3. Install Dependencies
You must install dependencies for both the backend and frontend.

**Backend:**
```bash
cd backend
npm install
```
**Frontend**
```bash
cd frontend
npm install
```

### 4. Environment Variables
Create a .env file inside the backend folder and add the following keys:

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

## Running the Application
To run the full application, you need to open 3 separate terminals:

### Terminal 1: Start the Backend API
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

### Terminal 2: Start the AI Worker
This process handles PDF parsing and embedding generation.
```bash
cd backend
npm run worker
```

### Terminal 3: Start the Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173
