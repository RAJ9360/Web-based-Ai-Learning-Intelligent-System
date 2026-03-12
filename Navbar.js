import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userEmail");

    // Update state
    setIsLoggedIn(false);

    // Redirect to home
    navigate("/");
  };

  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <nav className="navbar">
      <div className="nav-container">

        <h2 className="logo">AI Learning</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {/* ===== Not Logged In ===== */}
          {!isLoggedIn && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="primary-btn">
                Register
              </Link>
            </>
          )}

          {/* ===== Logged In ===== */}
          {isLoggedIn && (
            <>
              {isAdmin ? (
                <Link to="/admin">Admin Panel</Link>
              ) : (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/quiz">Quiz</Link>
                  <Link to="/recommendation">AI Result</Link>
                  <Link to="/progress">Progress</Link>
                </>
              )}

              {/* Show user email */}
              <span className="user-email">
                {userEmail}
              </span>

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
