# Capstone-Node-JS-pro

Personal Finance Tracker — Full Stack Web Application built with React (JSX), Tailwind CSS, shadcn/ui, TanStack Query & Table, Node.js, Express, MongoDB Atlas, and Cloudinary.

---

## 🌟 Key Features

* **Authentication & Authorization**: JWT-based authentication with bcrypt password hashing and Role-Based Access Control (Admin / Standard User).
* **Modern Frontend**: React (JSX) powered by Vite, styled with Tailwind CSS, shadcn/ui, and Lucide icons.
* **State & Data Tables**: TanStack Query v5 for server state caching and TanStack Table v8 for sorting, searching, and pagination.
* **Financial Analytics**: Recharts visual trend graphs, monthly income vs. expense breakdowns, and category expense distribution.
* **Cloudinary Media Storage**: Avatar upload with Cloudinary media integration.
* **Swagger Documentation**: Interactive OpenAPI / Swagger API documentation at `/docs`.
* **Organized Clean Monorepo**: Separated `frontend/` and `backend/` folders running concurrently via `npm run dev`.

---

## 📁 Project Architecture

```text
Capstone-Node-JS-pro/
├── package.json                 # Monorepo root script runner
├── .gitignore                   # Ignores .env, node_modules, and dist
├── README.md                    # Project documentation
├── POSTMAN_GUIDE.md             # Complete API testing manual
├── postman_collection.json      # Ready-to-import Postman test collection
│
├── 📂 backend/                  # REST API Server
│   ├── .env.example             # Template environment variables
│   ├── package.json             # Backend dependencies
│   ├── src/                     # Controllers, models, routes, middleware
│   └── tests/                   # 17 automated integration tests
│
└── 📂 frontend/                 # React Single Page App
    ├── index.html               # Frontend HTML root
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite dev proxy configuration
    ├── tailwind.config.js       # Tailwind CSS config
    └── src/                     # React components, pages, context, and API clients
```

---

## 🚀 Quick Start

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### 2. Environment Setup
Create a `.env` file in the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

Fill in your MongoDB URI, JWT Secret, and Cloudinary keys:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 4. Run Both Servers
```bash
# Starts Express API (port 5000) & Vite React App (port 3000) concurrently
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **Swagger API Docs**: [http://localhost:5000/docs](http://localhost:5000/docs)

---

## 🧪 Testing the API
* Automated integration test suite:
  ```bash
  npm run test:backend
  ```
* Postman testing: Import `postman_collection.json` into Postman and follow `POSTMAN_GUIDE.md`.
