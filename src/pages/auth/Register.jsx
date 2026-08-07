import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";
import "../../styles/auth.css";

function Register() {
    const [registerData, setRegisterData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER"
    });

    const handleChange = (e) => {

        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            registerData.firstName === "" ||
            registerData.lastName === "" ||
            registerData.email === "" ||
            registerData.password === ""
        ) {
            alert("Please fill all fields");
            return;
        }
        try {
            console.log(registerData);
            const response = await api.post("/api/users", registerData);

            alert("Registration Successful!");

            console.log(response.data);

        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);
            console.log("Sending:", registerData);

            alert("Registration Failed!");

            console.log(error);

        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h2 className="text-center mb-2">
                    Create Account
                </h2>

                <p className="text-center text-muted mb-4">
                    Join FinanceFlow
                </p>

                <form  onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={registerData.firstName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter first name"
                        />

                    </div>
                    <div className="mb-3">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={registerData.lastName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your email"
                        />

                    </div>

                    <div className="mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={registerData.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your password"
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100">
                        Register
                    </button>

                </form>

                <p className="text-center mt-4">

                    Already have an account?

                    <Link
                        to="/"
                        className="ms-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;