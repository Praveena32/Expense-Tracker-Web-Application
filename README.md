# Expense Tracker — Full-Stack UI (React + Vite + Tailwind CSS)

A complete, modern, and production-ready **Personal Finance Dashboard, Registration, and Login UI** built for an Expense & Budget Tracker web application. Built with **React.js**, **Vite**, **Tailwind CSS**, **Recharts**, and **React Router**, following a consistent design system.

---

## 🚀 Live Preview & Running Locally

The application runs via Vite on port 3000:

```powershell
# Install dependencies
npm.cmd install

# Start development server
npm.cmd run dev
```

### Application Routes:
* **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
* **Transactions**: [http://localhost:3000/transactions](http://localhost:3000/transactions)
* **Budgets**: [http://localhost:3000/budgets](http://localhost:3000/budgets)
* **Registration**: [http://localhost:3000/register](http://localhost:3000/register)
* **Login**: [http://localhost:3000/login](http://localhost:3000/login)

---

## 📐 Dashboard Layout & Features

### 1. Sidebar Navigation (Desktop Fixed & Mobile Slide-In)
* **Branding**: Geometric wallet logo with `"Expense Tracker PRO FINANCE"` badge.
* **Navigation Links**:
  * `Dashboard` (`/dashboard`)
  * `Transactions` (`/transactions`)
  * `Budgets` (`/budgets`)
* **Collapsible Toggle**: Smooth collapse to icon-only mode (`w-20` vs `w-64`).
* **Preferences & Logout**: Bottom actions linking to `/login`.

### 2. Top Navigation Bar
* **Title & Greeting**: `"Dashboard"` with personalized subtitle `"Good morning, John 👋 — Here's your financial overview."`
* **Notifications**: Notification bell with unread badge and dropdown flyout.
* **User Profile**: Profile avatar with online indicator, user role (`"Pro User"`), and account menu.

### 3. Summary Cards (4 Metrics)
* **Total Income**: `Rs. 150,000` (`+8.2% from last month`, positive emerald styling).
* **Total Expenses**: `Rs. 82,500` (`+4.5% from last month`, rose/expense styling).
* **Current Balance**: `Rs. 67,500` (`Available balance`, `+12.8%`).
* **Monthly Budget**: `Rs. 100,000` (`82.5% used` with progress indicator bar).

### 4. Interactive Charts (Recharts)
* **Expense Overview**: Donut chart displaying expenditures by category (Food, Bills, Shopping, Transport, Entertainment, Health, Education) with central count and category legend.
* **Income vs Expenses**: 6-month comparative bar chart (July through December) comparing income vs expenses.

### 5. Recent Transactions & Budget Progress
* **Recent Transactions**: Categorized transactions with date, tags, and color-coded amounts (`+Rs.` / `-Rs.`).
* **Budget Progress**: Category budgets with 3 visual status states:
  * **Normal (< 75%)**: Emerald green progress bar (e.g., Transport at 60%).
  * **Warning (75%–99%)**: Amber progress bar (e.g., Food at 77%, Entertainment at 84%).
  * **Exceeded (100%+)**: Red progress bar with warning tag (e.g., Shopping at 110%, Over by Rs. 1,200).

### 6. Quick Actions
* Accessible action buttons:
  * `+ Add Expense` (opens modal)
  * `+ Add Income` (opens modal)
  * `Set Budget` (opens modal)

### 7. Preview Mode Sandbox
Includes an interactive state switcher at the top:
* **Active Data**: Live mock data.
* **Loading Skeletons**: Shimmering skeleton placeholders for cards, charts, and lists.
* **Empty States**: Empty state illustrations and call-to-action buttons.

---

## 📂 Reusable Component Architecture

```text
src/
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.jsx             # Collapsible desktop sidebar & mobile slide-out drawer
│   │   ├── Topbar.jsx              # Navigation header with notifications & user profile
│   │   ├── SummaryCard.jsx         # Summary cards with trend badges & progress bars
│   │   ├── ExpenseChart.jsx        # Recharts Donut chart with category legend
│   │   ├── IncomeExpenseChart.jsx  # Recharts 6-month comparative bar chart
│   │   ├── RecentTransactions.jsx  # Transaction list with category icons & amounts
│   │   ├── BudgetProgress.jsx      # Budget meters with Normal, Warning & Exceeded states
│   │   └── QuickActions.jsx        # + Add Expense, + Add Income, Set Budget action buttons
│   ├── common/
│   │   ├── ActionModal.jsx         # Modal dialog for Quick Actions
│   │   ├── EmptyState.jsx          # Reusable empty state view
│   │   └── Skeleton.jsx            # Pulse loading skeleton components
│   └── auth/
│       ├── InputField.jsx
│       ├── PasswordInput.jsx
│       ├── PasswordStrength.jsx
│       ├── Checkbox.jsx
│       └── Button.jsx
├── data/
│   └── dashboardData.js            # Decoupled mock data architecture
├── layouts/
│   └── AuthLayout.jsx              # Two-column authentication layout
├── pages/
│   ├── Dashboard.jsx               # Dashboard page
│   ├── Transactions.jsx            # Transactions history view
│   ├── Budgets.jsx                 # Budget management view
│   ├── Register.jsx                # Registration page
│   └── Login.jsx                   # Login page
├── App.jsx                         # React Router routes
├── main.jsx                        # React entry point
└── index.css                       # Tailwind CSS directives
```
