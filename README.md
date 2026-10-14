# Expense & Budget Tracker — Full-Stack Personal Finance Application

A production-ready, full-stack **Personal Finance Management, Expense Tracking, and Monthly Budgeting Application** built with **React.js**, **Node.js/Express.js**, and **MongoDB/Mongoose**.

---

## 📌 Project Description

The **Expense & Budget Tracker** empowers users to take full control of their personal finances. Users can record and organize income streams and expenditures, establish monthly category-specific budget limits with real-time spend tracking, visualize spending distributions via interactive charts, and monitor their net cash flow.

All financial data is secured via **JSON Web Tokens (JWT)** and **bcrypt.js password hashing**, ensuring multi-user isolation where each user has access only to their own financial records.

---

## ✨ Features

### 1. User Authentication & Security
- **User Registration**: Secure account creation with name, email, and password.
- **User Login**: Credentials verification and JWT token issuance.
- **JWT Authentication**: Bearer token authentication header on all protected endpoints.
- **Strict User Isolation**: Queries enforce user ownership (`userId`), preventing any user from viewing or mutating another user's records.
- **Password Hashing**: Passwords hashed with `bcryptjs` (salt rounds: 10); hashes are never exposed in API responses.
- **Client Route Protection**: Unauthenticated visitors redirected to `/login`; authenticated users redirected away from auth pages to `/dashboard`.

### 2. Financial Dashboard
- **Summary Cards**:
  - Total Income
  - Total Expenses
  - Current Net Balance (Income - Expenses)
  - Monthly Budget Cap & Utilization Percentage
- **Interactive Visualizations (Recharts)**:
  - **Expense Breakdown Donut Chart**: Category percentage distribution with interactive tooltips and legend.
  - **Income vs Expenses Bar Chart**: 6-month historical monthly cashflow comparison.
- **Recent Transactions**: Up-to-date feed of the latest transactions with category icons, date, and color-coded amounts.
- **Budget Progress Meters**: Category-specific progress bars with 3 dynamic status states:
  - *Normal* (< 75%): Emerald progress indicator.
  - *Warning* (75% - 99%): Amber progress indicator.
  - *Exceeded* (100%+): Red progress indicator with over-budget alerts.
- **Quick Action Modals**: Direct creation of expenses, income streams, and budget limits from the dashboard.

### 3. Income & Expense Management (`/transactions`)
- **Add Transactions**: Record income streams or expenses with description, amount, category, and date.
- **Edit Transactions**: Update transaction details, amounts, or categorization.
- **Delete Transactions**: Remove transactions with user confirmation dialogs.
- **Search & Filters**:
  - Full-text search across descriptions and categories.
  - Filter by transaction type (`All`, `Income`, `Expense`).
  - Filter by category (`Food`, `Transport`, `Shopping`, `Bills`, etc.).
- **CSV Export**: Export filtered transaction logs directly to `.csv` format.

### 4. Monthly Budget Management (`/budgets`)
- **Category Budgets**: Set spending limits per category for any month and year (including `Housing`, `Food & Dining`, `Transportation`, `Utilities`, `Entertainment`, `Healthcare`, `Shopping`, `Personal Care`, `Education`, `Emergency`, `Savings (Deposit)`, `Loan Settlements`, and `Other`).
- **Dynamic Spend Calculation**: Real-time spending aggregated directly from actual database expense records.
- **Remaining Balance & Over-Budget Alerts**: Automatic calculation of remaining allowances and exceeded margins.
- **Month / Year Switcher**: Review past performance and plan ahead for upcoming months.

### 5. User Account & Profile (`/account`, `/profile`)
- **Financial Profile Overview**: Summary of account tenure, total active budgets, and net lifetime balance.
- **Personal Details Management**: View and update full name, email address, phone, and role.
- **Security & Password Management**: Self-service password change with confirmation verification.
- **Consistent User Context**: User information, avatar, and dynamic greetings are rendered consistently across Dashboard, Transactions, Budgets, Account, and Settings.

### 6. Settings & Preferences (`/settings`)
- **Currency & Localization**: Switch default currency symbols and decimal formats (INR ₹, USD $, EUR €, GBP £).
- **Date Formatting**: Select between customizable date display standards (`YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`).
- **Budget Notification Thresholds**: Adjust the over-budget alert warning trigger (from 50% to 95%).
- **Email & Push Notification Toggles**: Manage automated digest and low-balance warning alerts.
- **Account Data Export & Danger Zone**: Download personal finance snapshots or purge stored account records.

---

## 🛠️ Technologies Used

### Frontend Architecture
| Technology | Version | Purpose & Implementation |
| :--- | :--- | :--- |
| **React.js** | `v18.3.1` | Component-based UI library powering declarative layouts, stateful components, and hooks (`useState`, `useEffect`, `useContext`, `useRef`). |
| **Vite** | `v5.4.14` | Next-generation frontend build tool and dev server featuring lightning-fast Hot Module Replacement (HMR) and optimized Rollup bundling. |
| **React Router** | `v6.29.0` | Client-side routing engine enabling SPA navigation, nested layouts, authorization guards, and `<ProtectedRoute>` mechanics. |
| **Tailwind CSS** | `v3.4.17` | Utility-first styling framework configured with responsive breakpoints, emerald/dark accents, custom scrollbars, and modern typography. |
| **PostCSS & Autoprefixer** | `v8.5.2` / `v10.4.20` | CSS parsing, bundling, and automated cross-browser vendor prefixing pipeline. |
| **Recharts** | `v3.10.1` | Composable SVG data visualization library rendering the category expense Donut Chart and 6-month comparative cashflow Bar Chart. |
| **Lucide React** | `v0.475.0` | Crisp, modern iconography representing transaction categories, budget trajectories, navigation anchors, and status notifications. |

### Backend Architecture
| Technology | Version | Purpose & Implementation |
| :--- | :--- | :--- |
| **Node.js** | `>= v18.0.0` | High-performance asynchronous JavaScript runtime utilizing native ECMAScript Modules (`import` / `export`). |
| **Express.js** | `v4.21.2` | Minimalist web framework managing REST API endpoints, routing tiers, and centralized middleware pipelines. |
| **JSON Web Tokens (JWT)** | `v9.0.2` | Stateless Bearer token authentication facilitating secure session verification and user identification across protected endpoints. |
| **bcryptjs** | `v3.0.3` | Cryptographic password hashing utilizing 10 salt rounds to securely hash and compare credentials without exposing raw passwords. |
| **CORS** | `v2.8.5` | Cross-Origin Resource Sharing middleware enabling secure cross-origin API requests from the Vite frontend client. |
| **Dotenv** | `v16.4.7` | Runtime configuration loader injecting sensitive environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) from `.env` files. |

### Database & Storage Tier
| Technology | Version | Purpose & Implementation |
| :--- | :--- | :--- |
| **MongoDB** | `>= v6.0.0` | Document-oriented NoSQL database storing user accounts, financial transactions, and monthly category budgets. |
| **Mongoose** | `v8.10.1` | Object Data Modeling (ODM) library enforcing strict schemas, type validation, pre-save hooks, and virtual transforms (`toJSON`). |
| **MongoDB Memory Server** | `v10.1.4` | In-memory binary fallback providing zero-configuration, instant local development and automated testing out of the box. |

### Security & Architecture Highlights
- **Strict User Isolation**: All database operations (`Transaction.find`, `Budget.findOneAndUpdate`, `aggregate`) enforce `{ userId: req.user._id }`.
- **Compound Database Indexes**:
  - `Budget`: Unique compound index on `{ userId: 1, category: 1, month: 1, year: 1 }` preventing duplicate monthly budget records per category.
  - `Transaction`: Compound index on `{ userId: 1, date: -1 }` guaranteeing sub-millisecond sorting on ledger feeds.
- **Stateless Bearer Authorization**: Protects all transaction, budget, and dashboard routes via `Authorization: Bearer <token>` header checking.
- **Fail-Safe Database Connection**: Dynamically attempts MongoDB Atlas or local MongoDB; seamlessly initializes an in-memory database instance if local daemon is inactive.

---

## 📂 Project Structure

```text
Expense Tracker/
├── .env.example                     # Frontend environment template
├── .gitignore                       # Git ignore configuration
├── index.html                       # HTML entry point
├── package.json                     # Frontend scripts & dependencies
├── tailwind.config.js               # Tailwind CSS theme configuration
├── vite.config.js                   # Vite configuration
├── server/                          # Backend Express Application
│   ├── config/
│   │   └── db.js                    # MongoDB connection module (Atlas/Local/In-Memory)
│   ├── controllers/
│   │   ├── authController.js        # Registration, login, profile logic
│   │   ├── transactionController.js # Transaction CRUD, search, and filtering
│   │   ├── budgetController.js      # Budget CRUD and progress aggregation
│   │   └── dashboardController.js   # Financial summaries and chart metrics
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT Bearer token authentication middleware
│   │   ├── errorMiddleware.js       # Centralized error handler (400, 401, 404, 409, 500)
│   │   └── validationMiddleware.js  # Request validation helpers
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt pre-save hashing
│   │   ├── Transaction.js           # Transaction schema with compound indexes
│   │   └── Budget.js                # Budget schema with unique month/year compound index
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth routes
│   │   ├── transactionRoutes.js     # /api/transactions routes
│   │   ├── budgetRoutes.js          # /api/budgets routes
│   │   └── dashboardRoutes.js       # /api/dashboard routes
│   ├── utils/
│   │   └── jwt.js                   # JWT signing helper
│   ├── .env.example                 # Backend environment template
│   ├── package.json                 # Backend dependencies & scripts
│   ├── server.js                    # Express app entry & database bootstrap
│   └── test-api.js                  # Automated 14-point API verification test suite
└── src/                             # Frontend React Application
    ├── components/
    │   ├── auth/                    # InputField, PasswordInput, PasswordStrength, Button
    │   ├── common/                  # ActionModal, EmptyState, Skeleton, ProtectedRoute
    │   └── dashboard/               # Topbar, Sidebar, SummaryCard, Charts, QuickActions
    ├── context/
    │   └── AuthContext.jsx          # User session, JWT state, login, register, logout
    ├── layouts/
    │   └── AuthLayout.jsx           # Clean split-screen authentication layout
    ├── pages/
    │   ├── Dashboard.jsx            # Live dashboard with cards, charts, and quick actions
    │   ├── Transactions.jsx         # Transactions management with search, filter, CSV
    │   ├── Budgets.jsx              # Category budgeting with monthly progress meters
    │   ├── Account.jsx              # User account, profile stats, and security management
    │   ├── Settings.jsx             # System preferences, currencies, notifications & data export
    │   ├── Login.jsx                # Login page with real authentication & feedback
    │   └── Register.jsx             # Register page with strength validation
    ├── services/
    │   ├── api.js                   # Centralized HTTP client with Bearer interceptor
    │   ├── authService.js           # Auth endpoints integration
    │   ├── transactionService.js    # Transactions endpoints integration
    │   ├── budgetService.js         # Budgets endpoints integration
    │   └── dashboardService.js      # Dashboard endpoints integration
    ├── App.jsx                      # Route definitions & AuthProvider wrapper
    └── main.jsx                     # React DOM entry
```

---

## ⚙️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- Optional: MongoDB Community Server or MongoDB Atlas connection URI (if absent, the application automatically uses an in-memory development database).

---

## 🔑 Environment Variables

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
```

### Frontend (`.env` in root):
```env
VITE_API_URL=http://localhost:5000/api
```

*(Refer to `.env.example` and `server/.env.example` for starter templates)*

---

## 🚀 How to Run the Application

### 1. Install Dependencies

In the root directory (Frontend):
```bash
npm.cmd install
```

In the `server` directory (Backend):
```bash
cd server
npm.cmd install
cd ..
```

---

### 2. Start the Backend Server

```bash
# From root directory:
npm.cmd run server

# Or directly from server/:
cd server
node server.js
```

The backend server starts on `http://localhost:5000`. It connects to MongoDB (or starts the in-memory development database if a local daemon is not running).

---

### 3. Start the Frontend Development Server

```bash
# In a separate terminal in root directory:
npm.cmd run dev
```

Open your browser at `http://localhost:5173` (or the port indicated by Vite).

---

### 4. Running the Automated API Test Suite

An automated end-to-end test suite is included in `server/test-api.js` to verify all 14 requirements (Registration, Duplicate Handling, Login, Invalid Credentials, Route Protection, Income Creation, Expense Creation, Editing, Deletion, Search/Filtering, Budgets, Dynamic Spending Calculation, Dashboard Analytics, and Multi-User Isolation):

```bash
npm.cmd run test:api
```

---

## 📡 API Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Transactions (`/api/transactions`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Private | List user transactions (supports `?type=`, `?category=`, `?search=`) |
| `POST` | `/api/transactions` | Private | Create income or expense record |
| `GET` | `/api/transactions/:id` | Private | Get single transaction by ID |
| `PUT` | `/api/transactions/:id` | Private | Update transaction |
| `DELETE` | `/api/transactions/:id` | Private | Delete transaction |

### Budgets (`/api/budgets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/budgets` | Private | List category budgets with dynamic spend calculation |
| `POST` | `/api/budgets` | Private | Create or update category budget target |
| `GET` | `/api/budgets/:id` | Private | Get single budget with progress metrics |
| `PUT` | `/api/budgets/:id` | Private | Update category budget |
| `DELETE` | `/api/budgets/:id` | Private | Delete category budget |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | Private | Aggregated income, expenses, balance, categories, charts, and budgets |

---

## 🔮 Future Improvements

- Recurring scheduled transactions (e.g., auto-logging recurring subscriptions or rent).
- PDF report generation with formatted expense receipts.
- Multi-currency support and real-time exchange rates.
- Dark mode theme toggle.
- Email notifications when a category budget exceeds 90%.
