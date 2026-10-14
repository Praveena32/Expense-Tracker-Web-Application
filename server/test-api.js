const BASE_URL = 'http://localhost:5000/api';

async function testSuite() {
  console.log('====================================');
  console.log('STARTING FULL-STACK API TEST SUITE');
  console.log('====================================');

  const timestamp = Date.now();
  const userAData = {
    name: 'Alice User',
    email: `alice_${timestamp}@example.com`,
    password: 'Password123!',
  };
  const userBData = {
    name: 'Bob User',
    email: `bob_${timestamp}@example.com`,
    password: 'Password123!',
  };

  let tokenA = '';
  let tokenB = '';

  // 1. Register User A
  console.log('\n[1] Registering User A...');
  const regResA = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userAData),
  });
  const regJsonA = await regResA.json();
  console.log('Status:', regResA.status, '| Success:', regJsonA.success);
  if (regResA.status !== 201 || !regJsonA.token) {
    throw new Error('Registration User A failed: ' + JSON.stringify(regJsonA));
  }
  tokenA = regJsonA.token;

  // 2. Duplicate Registration Check
  console.log('\n[2] Checking Duplicate Registration for User A email...');
  const dupRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userAData),
  });
  const dupJson = await dupRes.json();
  console.log('Status:', dupRes.status, '(Expected 409) | Message:', dupJson.message);
  if (dupRes.status !== 409) {
    throw new Error('Duplicate check failed: expected 409, got ' + dupRes.status);
  }

  // 3. User Login
  console.log('\n[3] Logging in User A...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userAData.email, password: userAData.password }),
  });
  const loginJson = await loginRes.json();
  console.log('Status:', loginRes.status, '| User:', loginJson.user?.name);
  if (loginRes.status !== 200 || !loginJson.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginJson));
  }

  // 4. Invalid Password Check
  console.log('\n[4] Checking Wrong Password...');
  const wrongPassRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userAData.email, password: 'WrongPassword999' }),
  });
  console.log('Status:', wrongPassRes.status, '(Expected 401)');
  if (wrongPassRes.status !== 401) {
    throw new Error('Expected 401 for wrong password');
  }

  // 5. Protected Route Guard Check
  console.log('\n[5] Checking Protected Route with no token...');
  const unauthRes = await fetch(`${BASE_URL}/transactions`);
  console.log('Status:', unauthRes.status, '(Expected 401)');
  if (unauthRes.status !== 401) {
    throw new Error('Expected 401 for unauthenticated request');
  }

  // 6. Register User B
  console.log('\n[6] Registering User B...');
  const regResB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userBData),
  });
  const regJsonB = await regResB.json();
  tokenB = regJsonB.token;

  // 7. Add Income for User A
  console.log('\n[7] Adding Income for User A...');
  const incRes = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      type: 'income',
      amount: 150000,
      category: 'Salary',
      description: 'Monthly Salary Deposit',
      date: new Date().toISOString(),
    }),
  });
  const incJson = await incRes.json();
  console.log('Status:', incRes.status, '| Created Income:', incJson.data?.formattedAmount);

  // 8. Add Expenses for User A
  console.log('\n[8] Adding Expense 1 (Food) for User A...');
  const expRes1 = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      type: 'expense',
      amount: 2500,
      category: 'Food',
      description: 'Supermarket Groceries',
      date: new Date().toISOString(),
    }),
  });
  const expJson1 = await expRes1.json();
  const txIdToEdit = expJson1.data._id;
  console.log('Status:', expRes1.status, '| Expense 1 ID:', txIdToEdit);

  console.log('Adding Expense 2 (Transport) for User A...');
  const expRes2 = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      type: 'expense',
      amount: 1200,
      category: 'Transport',
      description: 'Taxi Ride',
      date: new Date().toISOString(),
    }),
  });
  const expJson2 = await expRes2.json();
  const txIdToDelete = expJson2.data._id;

  // 9. Edit Transaction for User A
  console.log('\n[9] Editing Expense 1 (Changing amount from 2500 to 3000)...');
  const editRes = await fetch(`${BASE_URL}/transactions/${txIdToEdit}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      amount: 3000,
      description: 'Supermarket Groceries (Organic)',
    }),
  });
  const editJson = await editRes.json();
  console.log('Status:', editRes.status, '| Updated Amount:', editJson.data?.amount);
  if (editJson.data?.amount !== 3000) {
    throw new Error('Update failed, amount mismatch');
  }

  // 10. Delete Transaction for User A
  console.log('\n[10] Deleting Expense 2...');
  const delRes = await fetch(`${BASE_URL}/transactions/${txIdToDelete}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${tokenA}`,
    },
  });
  console.log('Status:', delRes.status, '(Expected 200)');

  // 11. Search & Filter Transactions for User A
  console.log('\n[11] Testing Filter by Type=expense & Search=Organic...');
  const searchRes = await fetch(
    `${BASE_URL}/transactions?type=expense&search=Organic`,
    {
      headers: { Authorization: `Bearer ${tokenA}` },
    }
  );
  const searchJson = await searchRes.json();
  console.log('Status:', searchRes.status, '| Count:', searchJson.count, '| Results:', searchJson.data?.map(t => t.description));
  if (searchJson.count !== 1) {
    throw new Error('Expected 1 transaction in search');
  }

  // 12. Create Category Budget for User A
  console.log('\n[12] Setting Monthly Budget for Food (Rs. 15,000)...');
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgetRes = await fetch(`${BASE_URL}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      category: 'Food',
      amount: 15000,
      month: currentMonth,
      year: currentYear,
    }),
  });
  const budgetJson = await budgetRes.json();
  console.log('Status:', budgetRes.status, '| Budget:', budgetJson.data?.formattedBudget, '| Spent:', budgetJson.data?.formattedSpent, '| Progress:', `${budgetJson.data?.progress}%`);
  if (budgetJson.data?.spent !== 3000) {
    throw new Error('Expected spent to match actual food expense (3000), got: ' + budgetJson.data?.spent);
  }

  // 13. Test Dashboard Endpoint for User A
  console.log('\n[13] Fetching Dashboard for User A...');
  const dashRes = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const dashJson = await dashRes.json();
  console.log('Status:', dashRes.status);
  console.log('Total Income:', dashJson.data?.summary?.totalIncome?.formatted);
  console.log('Total Expenses:', dashJson.data?.summary?.totalExpenses?.formatted);
  console.log('Current Balance:', dashJson.data?.summary?.currentBalance?.formatted);
  console.log('Recent Transactions Count:', dashJson.data?.recentTransactions?.length);
  console.log('Expense Categories:', dashJson.data?.expenseByCategory);
  console.log('Monthly Charts Points:', dashJson.data?.incomeVsExpensesMonthly?.length);

  // Verify Calculations
  if (dashJson.data?.summary?.totalIncome?.amount !== 150000) {
    throw new Error('Dashboard total income calculation mismatch');
  }
  if (dashJson.data?.summary?.totalExpenses?.amount !== 3000) {
    throw new Error('Dashboard total expense calculation mismatch');
  }
  if (dashJson.data?.summary?.currentBalance?.amount !== 147000) {
    throw new Error('Dashboard balance calculation mismatch');
  }

  // 14. MULTI-USER SECURITY ISOLATION CHECK
  console.log('\n[14] Checking Multi-User Security Isolation:');
  console.log('User B should see 0 transactions and 0 budgets:');
  const userBTxRes = await fetch(`${BASE_URL}/transactions`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const userBTxJson = await userBTxRes.json();
  console.log('User B Transactions Count:', userBTxJson.count, '(Expected 0)');
  if (userBTxJson.count !== 0) {
    throw new Error('SECURITY VIOLATION: User B can see User A transactions!');
  }

  console.log('User B attempting to access User A transaction directly by ID...');
  const crossAccessRes = await fetch(`${BASE_URL}/transactions/${txIdToEdit}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log('Status:', crossAccessRes.status, '(Expected 404)');
  if (crossAccessRes.status !== 404) {
    throw new Error('SECURITY VIOLATION: User B accessed User A transaction by ID!');
  }

  const userBBudgetRes = await fetch(`${BASE_URL}/budgets`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const userBBudgetJson = await userBBudgetRes.json();
  console.log('User B Budgets Count:', userBBudgetJson.count, '(Expected 0)');
  if (userBBudgetJson.count !== 0) {
    throw new Error('SECURITY VIOLATION: User B can see User A budgets!');
  }

  console.log('\n====================================');
  console.log('ALL API TESTS PASSED SUCCESSFULLY! (14/14)');
  console.log('====================================');
}

testSuite().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
