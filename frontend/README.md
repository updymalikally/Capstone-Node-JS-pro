# FinanceFlow - Personal Finance Tracker (Frontend)

Modern, reactive frontend for the Personal Finance Tracker capstone project built with **React (JSX)**, **TanStack Query (v5)**, **TanStack Table (v8)**, **Tailwind CSS**, and **shadcn/ui**.

---

## 🛠️ Tech Stack & Features

- **React 18** with pure JavaScript (`.jsx`)
- **Vite** for fast HMR and optimized builds
- **TanStack Query (v5)**: Data caching, background refetching, mutation lifecycle, optimistic query invalidation
- **TanStack Table (v8)**: Rich transaction data tables with sorting, filtering, and pagination
- **Tailwind CSS + Tailwind Animate**: Modern typography, custom tokens, and animations
- **shadcn/ui**: Radix UI accessible primitives (Dialogs, Dropdown Menus, Selects, Tabs, Avatars, Badges, etc.)
- **Recharts**: Interactive Cashflow Trend area charts, Category spending donut charts, and Income vs Expense bar charts
- **Sonner**: Toast notifications for API mutations and user feedback
- **React Hook Form + Zod**: Form validation matching backend constraints
- **Dark & Light Mode**: Seamless theme toggling

---

## 🚀 Getting Started

### 1. Start the Express API Backend
From the project root:
```bash
npm run dev
# Backend starts at http://localhost:5000
```

### 2. Start the Frontend Dev Server
From the project root:
```bash
npm run dev:client
```
Or inside `frontend/`:
```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:3000
```

### 3. Build for Production
```bash
npm run build:client
```

---

## 📁 Key Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/login` | Sign In | JWT authentication with quick test account autofill |
| `/register` | Sign Up | User registration with currency preference selection |
| `/dashboard` | Dashboard | KPI summary cards, cashflow trend chart, category breakdown, quick-add transaction modal |
| `/transactions` | Transactions | **TanStack Table** with global search, type & category filters, date filters, sorting, CSV export, and CRUD modals |
| `/analytics` | Analytics | Monthly & yearly reports, cashflow distribution bar charts, and category percentage bars |
| `/categories` | Categories | Default & custom user categories with custom icons and color picker |
| `/profile` | Profile & Settings | User display name edit, default currency switcher, and avatar photo upload |
| `/admin` | Admin Console | System volume overview, registered users table (restricted to `admin` role) |
