import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";
import "../../styles/auth.css";
function Login(){
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [error,setError] = useState("");
    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit =async (e) => {

        e.preventDefault();
        try {
            console.log("Sending login data:", loginData);
            const response = await api.post("/api/auth/login", loginData);

            console.log(response.data);
            localStorage.setItem("token" , response.data.token);
            alert("Login Successful!");
            navigate("/dashboard");
        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);
           setError("Invalid email or password. Please try again.");
    }};
  return(
        <div className="auth-container">

               <div className="auth-card">

                   <h2 className="text-center mb-2">FinanceFlow</h2>

                   <p className="text-center text-muted mb-4">
                       Manage your finances with ease
                   </p>

                   <form onSubmit={handleSubmit}>
                       {error && (
                           <div className="alert alert-danger">
                           {error}
                           </div>
                       )}
                       <div className="mb-3">
                           <label>
                               Email
                           </label>

                           <input
                               type="email"
                               name="email"
                               value={loginData.email}
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
                       value={loginData.password}
                       onChange={handleChange}
                       className="form-control"
                       placeholder="Enter password"
                   />

               </div>

               <button type= "submit" className="btn btn-success w-100">
                   Login
               </button>
                   </form>
                   <p className="text-center mt-4">

                       Don't have an account?

                       <Link
                           to="/register"
                           className="ms-2"
                       >
                           Register
                       </Link>

                   </p>
               </div>

        </div>
    );
}
export default Login;