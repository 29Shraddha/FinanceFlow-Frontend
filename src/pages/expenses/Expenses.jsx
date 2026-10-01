import { useEffect, useState } from "react";
import api from "../../api/api";

function Expenses() {

    const [expenseData, setExpenseData] = useState({
        title: "",
        amount: "",
        category: "",
        expenseDate: "",
        description: ""
    });
    const [expenses, setExpenses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {

        const fetchExpenses = async () => {

            try {

                const response = await api.get("/api/expenses");

                console.log("Expenses:", response.data);

                setExpenses(response.data);

            } catch (error) {

                console.log("Status:", error.response?.status);
                console.log("Response:", error.response?.data);
               setError("Unable to load expenses. Please try again.");
            }
        };

        fetchExpenses();

    }, []);
    const handleChange = (e) => {

        setExpenseData({
            ...expenseData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            console.log("Sending expense:", expenseData);

            if (editingId) {

                // UPDATE existing expense
                const response = await api.put(
                    `/api/expenses/${editingId}`,
                    expenseData
                );

                console.log("Expense updated:", response.data);

                alert("Expense updated successfully!");

            } else {

                // CREATE new expense
                const response = await api.post(
                    "/api/expenses",
                    expenseData
                );

                console.log("Expense created:", response.data);

                alert("Expense added successfully!");
            }

            // Refresh expense list
            const updatedExpenses = await api.get("/api/expenses");

            setExpenses(updatedExpenses.data);

            // Clear form
            setExpenseData({
                title: "",
                amount: "",
                category: "",
                expenseDate: "",
                description: ""
            });

            // Exit edit mode
            setEditingId(null);

        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert(
                editingId
                    ? "Failed to update expense."
                    : "Failed to add expense."
            );
        }
    };
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        try {

            await api.delete(`/api/expenses/${id}`);

            alert("Expense deleted successfully!");

            const updatedExpenses = await api.get("/api/expenses");

            setExpenses(updatedExpenses.data);

        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert("Failed to delete expense.");

        }
    };
    const handleEdit = (expense) => {

        setEditingId(expense.id);

        setExpenseData({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            expenseDate: expense.expenseDate,
            description: expense.description || ""
        });

    };
    return (
        <div className="container mt-5">
        <div className="page-header">
            <h2>Expenses</h2>
            <p>Track and manage your expenses</p>
        </div>
            {error && (
                <div className="alert alert-danger mt-4">
                    {error}
                </div>
            )}
            <div className="expense-form mt-4">

                <h4 className="mb-4">
                    {editingId ? "Edit Expense" : "Add Expense"}
                </h4>

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div className="mb-3">
                        <label className="form-label">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={expenseData.title}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g. Groceries"
                        />
                    </div>

                    {/* Amount */}
                    <div className="mb-3">
                        <label className="form-label">
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={expenseData.amount}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter amount"
                            min="0.01"
                            step="0.01"
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                        <label className="form-label">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={expenseData.category}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g. Food"
                        />
                    </div>

                    {/* Date */}
                    <div className="mb-3">
                        <label className="form-label">
                            Expense Date
                        </label>

                        <input
                            type="date"
                            name="expenseDate"
                            value={expenseData.expenseDate}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={expenseData.description}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Optional description"
                            rows="3"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success me-2"
                    >
                        {editingId ? "Update Expense" : "Add Expense"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setEditingId(null);
                                setExpenseData({
                                    title: "",
                                    amount: "",
                                    category: "",
                                    expenseDate: "",
                                    description: ""
                                });
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

                    {expenses.length === 0 ? (

                        <p className="text-muted">
                            No expenses found.
                        </p>

                    ) : (

                        <div className="table-responsive">

                            <table className="expense-table">

                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                                </thead>

                                <tbody>

                                {expenses.map((expense) => (

                                    <tr key={expense.id}>

                                        <td>{expense.title}</td>

                                        <td>₹{expense.amount}</td>

                                        <td>{expense.category}</td>

                                        <td>{expense.expenseDate}</td>

                                        <td>{expense.description || "-"}</td>

                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(expense)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(expense.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>
            </div>


    );
}

export default Expenses;