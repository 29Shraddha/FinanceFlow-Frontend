import { useEffect, useState } from "react";
import api from "../../api/api";

function Income() {

    const [incomeData, setIncomeData] = useState({
        source: "",
        amount: "",
        incomeDate: "",
        description: ""
    });

    const [income, setIncome] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        const fetchIncome = async () => {

            try {

                const response = await api.get("/api/income");

                console.log("Income:", response.data);

                setIncome(response.data);

            } catch (error) {

                console.log("Status:", error.response?.status);
                console.log("Response:", error.response?.data);

            }
        };

        fetchIncome();

    }, []);

    const handleChange = (e) => {

        setIncomeData({
            ...incomeData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            console.log("Sending income:", incomeData);

            if (editingId) {

                const response = await api.put(
                    `/api/income/${editingId}`,
                    incomeData
                );

                console.log("Income updated:", response.data);

                alert("Income updated successfully!");

            } else {

                const response = await api.post(
                    "/api/income",
                    incomeData
                );

                console.log("Income created:", response.data);

                alert("Income added successfully!");
            }

            const updatedIncome = await api.get("/api/income");

            setIncome(updatedIncome.data);

            setIncomeData({
                source: "",
                amount: "",
                incomeDate: "",
                description: ""
            });

            setEditingId(null);

        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert(
                editingId
                    ? "Failed to update income."
                    : "Failed to add income."
            );

        }
    };

    const handleEdit = (item) => {

        setEditingId(item.id);

        setIncomeData({
            source: item.source,
            amount: item.amount,
            incomeDate: item.incomeDate,
            description: item.description || ""
        });

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this income?")) {
            return;
        }

        try {

            await api.delete(`/api/income/${id}`);

            alert("Income deleted successfully!");

            const updatedIncome = await api.get("/api/income");

            setIncome(updatedIncome.data);

        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert("Failed to delete income.");

        }
    };

    return (
        <div className="container mt-5">
          <div className="page-header">
            <h2>Income</h2>
             <p>Track and manage your income</p>
          </div>

            <div className="income-form mt-4">

                <h4 className="mb-4">
                    {editingId ? "Edit Income" : "Add Income"}
                </h4>

                <form onSubmit={handleSubmit}>

                    {/* Source */}
                    <div className="mb-3">

                        <label className="form-label">
                            Source
                        </label>

                        <input
                            type="text"
                            name="source"
                            value={incomeData.source}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g. Salary"
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
                            value={incomeData.amount}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter amount"
                            min="0.01"
                            step="0.01"
                        />

                    </div>

                    {/* Date */}
                    <div className="mb-3">

                        <label className="form-label">
                            Income Date
                        </label>

                        <input
                            type="date"
                            name="incomeDate"
                            value={incomeData.incomeDate}
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
                            value={incomeData.description}
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
                        {editingId ? "Update Income" : "Add Income"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setEditingId(null);

                                setIncomeData({
                                    source: "",
                                    amount: "",
                                    incomeDate: "",
                                    description: ""
                                });
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

            </div>

            {/* Income List */}

            <div className="card p-4 mt-4">

                <h4 className="mb-4">
                    Your Income
                </h4>

                {income.length === 0 ? (

                    <p className="text-muted">
                        No income found.
                    </p>

                ) : (

                    <div className="table-responsive">

                        <table className="income-table">

                            <thead>

                            <tr>
                                <th>Source</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>

                            </thead>

                            <tbody>

                            {income.map((item) => (

                                <tr key={item.id}>

                                    <td>{item.source}</td>

                                    <td>₹{item.amount}</td>

                                    <td>{item.incomeDate}</td>

                                    <td>
                                        {item.description || "-"}
                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(item.id)}
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

export default Income;