import { useEffect, useState } from "react";
import api from "../../api/api";

function Budgets() {

    const [budgetData, setBudgetData] = useState({
        category: "",
        budgetAmount: "",
        month: ""
    });

    const [budgets, setBudgets] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        const loadBudgets = async () => {

            try {

                const response = await api.get("/api/budgets");

                setBudgets(response.data);

            } catch (error) {

                console.log(error);

            }

        };

        loadBudgets();

    }, []);

    const handleChange = (e) => {
        setBudgetData({
            ...budgetData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            console.log("Sending budget:", budgetData);

            if (editingId) {

                const response = await api.put(
                    `/api/budgets/${editingId}`,
                    budgetData
                );

                console.log("Budget updated:", response.data);

                alert("Budget updated successfully!");

            } else {

                const response = await api.post(
                    "/api/budgets",
                    budgetData
                );

                console.log("Budget created:", response.data);

                alert("Budget added successfully!");

            }
            const updatedBudgets = await api.get("/api/budgets");
            setBudgets(updatedBudgets.data);

            setBudgetData({
                category: "",
                budgetAmount: "",
                month: ""
            });

            setEditingId(null);

        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert(
                editingId
                    ? "Failed to update budget."
                    : "Failed to add budget."
            );
        }
    };
    const handleEdit = (budget) => {

        setEditingId(budget.id);

        setBudgetData({
            category: budget.category,
            budgetAmount: budget.budgetAmount,
            month: budget.month
        });

    };
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/api/budgets/${id}`);

            alert("Budget deleted successfully!");
            const updatedBudgets = await api.get("/api/budgets");
            setBudgets(updatedBudgets.data);


        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert("Failed to delete budget.");

        }
    };

    return (
        <div className="container mt-5">

            <div className="page-header">
            <h2>Budget</h2>
            <p >Set and manage your monthly</p>
            </div>
            <div className="budget-form mt-4">

                <h4 className="mb-4">
                    {editingId ? "Edit Budget" : "Add Budget"}
                </h4>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={budgetData.category}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g. Food"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Budget Amount
                        </label>

                        <input
                            type="number"
                            name="budgetAmount"
                            value={budgetData.budgetAmount}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter budget amount"
                            min="0.01"
                            step="0.01"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Month
                        </label>

                        <input
                            type="month"
                            name="month"
                            value={budgetData.month}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success me-2"
                    >
                        {editingId ? "Update Budget" : "Add Budget"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setEditingId(null);

                                setBudgetData({
                                    category: "",
                                    budgetAmount: "",
                                    month: ""
                                });
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

            </div>

            <div className="card p-4 mt-4">

                <h4 className="mb-4">Your Budgets</h4>

                {budgets.length === 0 ? (

                    <p className="text-muted">
                        No budgets found.
                    </p>

                ) : (

                    <div className="table-responsive">

                        <table className="budget-table">

                            <thead>
                            <tr>
                                <th>Category</th>
                                <th>Budget Amount</th>
                                <th>Month</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>

                            {budgets.map((budget) => (

                                <tr key={budget.id}>

                                    <td>{budget.category}</td>

                                    <td>₹{budget.budgetAmount}</td>

                                    <td>{budget.month}</td>

                                    <td>

                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => handleEdit(budget)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(budget.id)}
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

export default Budgets;