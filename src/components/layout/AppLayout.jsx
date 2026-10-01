import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";
function AppLayout() {
    return (
        <div className="app-layout">

            <aside className="sidebar">

                <div className="logo">
                    FinanceFlow
                </div>

                <nav className="sidebar-nav">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        📊 <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/expenses"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        💸 <span>Expenses</span>
                    </NavLink>

                    <NavLink
                        to="/income"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        💰 <span>Income</span>
                    </NavLink>

                    <NavLink
                        to="/budgets"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        🎯 <span>Budgets</span>
                    </NavLink>

                </nav>

            </aside>

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default AppLayout;