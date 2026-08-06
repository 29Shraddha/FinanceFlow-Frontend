import { Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/auth.css";

function Register() {
    const [registerData, setRegisterData] = useState({

        name:"",
        email:"",
        password:""

    });

    const handleChange = (e) => {

        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        alert("Register button clicked!");

        console.log(registerData);
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
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={registerData.name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter your name"
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