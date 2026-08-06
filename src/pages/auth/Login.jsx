import { Link } from "react-router-dom";
import "../../styles/auth.css";
function Login(){
    return(
        <div className="auth-container">

               <div className="auth-card">

                   <h2 className="text-center mb-2">FinanceFlow</h2>

                   <p className="text-center text-muted mb-4">
                       Manage your finances with ease
                   </p>

                   <form>
                       <div className="mb-3">
                           <label>
                               Email
                           </label>
                           <input
                               type="email"
                               className="form-control"
                               placeholder="Enter your email"
                               />

               </div>


               <div className="mb-4">
                   <label>Password</label>
                   <input
                       type="password"
                       className="form-control"
                       placeholder="Enter your password"
                       />

               </div>

               <button className="btn btn-primary w-100">
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