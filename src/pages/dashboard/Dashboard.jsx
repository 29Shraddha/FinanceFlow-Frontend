import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import "./Dashboard.css";
function Dashboard() {

    const [dashboardData, setDashboardData] = useState(null);
    const [totalBudget, setTotalBudget] = useState(0);
   const [recentExpenses,  setRecentExpenses] = useState([]);
    const [budgetOverview, setBudgetOverview] = useState([]);
    const [recentIncome, setRecentIncome] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);

    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);

    const savingsPercentage =
        monthlyIncome > 0
            ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
            : 0;

    const currentMonth = new Date().toISOString().slice(0,7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await api.get("/api/dashboard");

                console.log("Dashboard data:", response.data);

                setDashboardData(response.data);

            } catch (error) {

                console.log("Status:", error.response?.status);
                console.log("Response:", error.response?.data);

            }
        };
        const fetchBudgets = async () => {

            try {

                const response = await api.get("/api/budgets");

                console.log("Budgets:", response.data);

                const total = response.data.reduce(
                    (sum, budget) =>
                        sum + Number(budget.budgetAmount),
                    0
                );

                setTotalBudget(total);
                const expenseResponse = await api.get("/api/expenses");

                const expenses = expenseResponse.data;
               console.log("Expenses for budget overview" ,expenses);
                const overview = response.data.map((budget) => {

                    const spent = expenses
                        .filter(
                            (expense) =>{
                                 const sameCategory =
                                expense.category.trim().toLowerCase() ===
                                budget.category.trim().toLowerCase();

                                const expenseMonth =
                                    expense.expenseDate.substring(0,7);

                                const sameMonth =
                                    expenseMonth === budget.month;

                                return sameCategory && sameMonth;

                        })
                        .reduce(
                            (sum, expense) =>
                                sum + Number(expense.amount),
                            0
                        );

                    return {
                        ...budget,
                        spent: spent,
                        remaining:
                            Number(budget.budgetAmount) - spent
                    };

                });

                setBudgetOverview(overview);
            } catch (error) {

                console.log("Budget Status:", error.response?.status);
                console.log("Budget Response:", error.response?.data);

            }
        };

        const fetchExpenses = async () => {

            try {
                console.log("1. Fetching expenses...");

                const response = await api.get("/api/expenses");

                console.log("2. DASHBOARD EXPENSE RESPONSE:", response.data);

                setRecentExpenses(response.data)
                const monthlyExpenseTotal = response.data
                    .filter((expense) =>
                        expense.expenseDate.startsWith(selectedMonth)
                    )
                    .reduce(
                        (sum, expense) =>
                            sum + Number(expense.amount),
                        0
                    );

                setMonthlyExpenses(monthlyExpenseTotal);
                const categoryTotals = {};

                response.data
                    .filter((expense) =>
                        expense.expenseDate.startsWith(selectedMonth)
                    )
                    .forEach((expense) => {

                        const category = expense.category?.trim() || "Other";

                        categoryTotals[category] =
                            (categoryTotals[category] || 0) +
                            Number(expense.amount);

                    });

                const categoryData = Object.entries(categoryTotals).map(
                    ([category, amount]) => ({
                        category,
                        amount
                    })
                );

                setExpenseCategories(categoryData);

            } catch (error) {
                console.log("3. EXPENSE ERROR");
                console.log("Status:", error.response?.status);
                console.log("Response:", error.response?.data);
                console.log("Error:", error);

            }

        };
        const fetchIncome = async() => {
            try {
                console.log("1. Fetching income...");
                const response = await api.get("/api/income");
                console.log("2. Dashboard Income Response: ", response.data);
                setRecentIncome(response.data);
                const monthlyIncomeTotal = response.data
                    .filter((income) =>
                        income.incomeDate.startsWith(selectedMonth)
                    )
                    .reduce(
                        (sum, income) =>
                            sum + Number(income.amount),
                        0
                    );

                setMonthlyIncome(monthlyIncomeTotal);
            }
            catch(error){
                console.log("3.Income error");
                console.log("Status:",error.response?.status);
                console.log("Response:",error.response?.data);
                console.log("Error:",error);
            }
        };
        
        fetchDashboard();
        fetchBudgets();

        fetchExpenses();
        fetchIncome();

    }, [selectedMonth]);

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">

                <div>
                    <h2>FinanceFlow Dashboard</h2>
                    <p className="text-muted mb-0">
                        Welcome to your financial dashboard.
                    </p>
                </div>

                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.replace("/");
                    }}
                >
                    Logout
                </button>

            </div>

            <div className="row mt-4">

                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Total Income</h5>
                        <h3>
                            ₹{dashboardData?.totalIncome ?? 0}
                        </h3>
                    </div>
                </div>

                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Total Expenses</h5>
                        <h3>
                            ₹{dashboardData?.totalExpense ?? 0}
                        </h3>
                    </div>
                </div>

                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Balance</h5>
                        <h3>
                            ₹{dashboardData?.balance ?? 0}
                        </h3>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Savings Rate</h5>

                        <h3>
                            {dashboardData?.totalIncome > 0
                                ? `${(
                                    (dashboardData.balance /
                                        dashboardData.totalIncome) *
                                    100
                                ).toFixed(1)}%`
                                : "0%"
                            }
                        </h3>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Total Budget</h5>
                        <h3>
                            ₹{totalBudget}
                        </h3>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Income Records</h5>
                        <h3>
                            {dashboardData?.incomeCount ?? 0}
                        </h3>
                    </div>
                </div>

                <div className="col-md-4 col-lg-3 mb-3">
                    <div className="dashboard-stat">
                        <h5>Expense Records</h5>
                        <h3>
                            {dashboardData?.expenseCount ?? 0}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="dashboard-section">

                <h4 className="mb-4">
                    Budget Overview
                </h4>

                {budgetOverview.length === 0 ? (

                    <p className="text-muted">
                        No budgets found.
                    </p>

                ) : (

                    budgetOverview.map((budget) => {

                        const percentage =
                            (budget.spent / Number(budget.budgetAmount)) * 100;

                        return (
                            <div key={budget.id} className="mb-4">

                                <div className="d-flex justify-content-between">

                                    <strong>
                                        {budget.category}
                                    </strong>

                                    <span>
                            ₹{budget.spent} / ₹{budget.budgetAmount}
                        </span>

                                </div>

                                <div className="progress mt-2">

                                    <div
                                        className={`progress-bar ${
                                            percentage >100 ? "bg-danger" : "bg-success"
                                        }`}
                                        role="progressbar"
                                        style={{
                                            width: `${Math.min(percentage, 100)}%`
                                        }}
                                    >
                                        {Math.round(percentage)}%
                                    </div>
                                </div>

                                <small className="text-muted">

                                    {budget.remaining >= 0
                                        ? `₹${budget.remaining} remaining`
                                        : `₹${Math.abs(budget.remaining)} over budget`
                                    }

                                </small>

                            </div>
                        );

                    })

                )}
            </div>
            <div className="dashboard-section">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h4 className="mb-0">
                        Monthly Summary
                    </h4>

                    <input
                        type="month"
                        className="form-control month-selector"
                        style={{ width: "200px" }}
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />

                </div>
                <div className="row g-3">

                    <div className="col-md-4">
                        <div className="border rounded p-3 h-100">
                        <h6 className="text-muted">
                            Monthly Income
                        </h6>
                        <h3 className="text-success">
                            ₹{monthlyIncome}
                        </h3>
                    </div>
                    </div>
                    <div className="col-md-4">
                        <div className="border rounded p-3 h-100">
                        <h6 className="text-muted">
                            Monthly Expenses
                        </h6>
                        <h3 className="text-danger">
                            ₹{monthlyExpenses}
                        </h3>
                    </div>
                    </div>
                    <div className="col-md-4">
                        <div className="border rounded p-3 h-100">
                        <h6 className="text-muted">
                            Monthly Savings
                        </h6>
                        <h3 className="text-primary">
                            ₹{monthlyIncome - monthlyExpenses}
                        </h3>
                    </div>

                </div>
                    <div className="col-md-4">
                        <div className="border rounded p-3 h-100">
                            <h6 className="text-muted">
                                Savings Rate
                            </h6>

                            <h3 className="text-info">
                                {savingsPercentage.toFixed(1)}%
                            </h3>
                        </div>
                    </div>
                </div>
                    <div className="mt-4">

                        {monthlyIncome > monthlyExpenses ? (
                            <div className="alert alert-success mb-0">
                                🎉 You're saving ₹{monthlyIncome - monthlyExpenses} this month.
                            </div>
                        ) : monthlyIncome === monthlyExpenses ? (
                            <div className="alert alert-warning mb-0">
                                ⚠️ Your income and expenses are equal this month.
                            </div>
                        ) : (
                            <div className="alert alert-danger mb-0">
                                ⚠️ You're spending ₹{monthlyExpenses - monthlyIncome} more than your income this month.
                            </div>
                        )}

                    </div>
            </div>
            <div className="dashboard-section">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h4 className="mb-0">
                        Recent Income
                    </h4>

                    <span className="text-muted">
            Latest income
        </span>

                </div>

                {recentIncome.length === 0 ? (

                    <p className="text-muted">
                        No income found.
                    </p>

                ) : (

                    <div className="table-responsive">

                        <table className="table">

                            <thead>
                            <tr>
                                <th>Source</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                            </thead>

                            <tbody>

                            {recentIncome.slice(0, 5).map((income) => (

                                <tr key={income.id}>

                                    <td>{income.source}</td>

                                    <td>
                                        ₹{income.amount}
                                    </td>

                                    <td>
                                        {income.incomeDate}
                                    </td>

                                    <td>
                                        {income.description || "-"}
                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

                <div className="mt-3">

                    <Link
                        to="/income"
                        className="btn btn-outline-success btn-sm"
                    >
                        View All Income
                    </Link>

                </div>

            </div>
            <div className="dashboard-section">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Recent Expenses</h4>

                    <span className="text-muted">
        Latest transactions
    </span>
                </div>


                <div className="table-responsive">

                    <table className="table">

                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Date</th>
                        </tr>
                        </thead>

                        <tbody>

                        {recentExpenses.slice(0, 5).map((expense) => (

                            <tr key={expense.id}>

                                <td>{expense.title}</td>
                                <td>₹{expense.amount}</td>
                                <td>{expense.category}</td>
                                <td>{expense.expenseDate}</td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>


                <div className="mt-3">
                    <Link
                        to="/expenses"
                        className="btn btn-primary"
                    >
                        View All Expenses
                    </Link>
                </div>

            </div>
            <div className="dashboard-section">

                <h4 className="mb-4">
                    Expense Breakdown
                </h4>

                {expenseCategories.length === 0 ? (

                    <p className="text-muted">
                        No expense data available.
                    </p>

                ) : (

                    expenseCategories.map((item) => (

                        <div key={item.category} className="mb-3">

                            <div className="d-flex justify-content-between">

                                <strong>
                                    {item.category}
                                </strong>

                                <span>
                        ₹{item.amount}
                    </span>

                            </div>

                            <div className="progress mt-2">

                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        width: `${
                                            dashboardData?.totalExpense > 0
                                                ? Math.min(
                                                    (item.amount /
                                                        dashboardData.totalExpense) *
                                                    100,
                                                    100
                                                )
                                                : 0
                                        }%`
                                    }}
                                >
                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>
                </div>

                );
            }

export default Dashboard;