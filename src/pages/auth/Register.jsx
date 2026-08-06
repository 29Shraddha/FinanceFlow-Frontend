import { Link } from "react-router-dom";
import "../../styles/auth.css";

function Register() {
    return (
        <div className="auth-container">

            <div className="auth-card">

                <h2 className="text-center mb-2">
                    Create Account
                </h2>

                <p className="text-center text-muted mb-4">
                    Join FinanceFlow
                </p>

                <form>

                    <div className="mb-3">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                        />
                    </div>

                    <button className="btn btn-success w-100">
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