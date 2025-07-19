import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

function LoginForm({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userData = { email, password, role };
    const endpoint = isSignup ? "signup" : "login";

    try {
      const res = await fetch(`http://localhost:8080/User/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const resultText = await res.text();

      if (res.ok) {
        if (isSignup) {
          alert("Signup successful! Please log in.");
          setIsSignup(false);
        } else {
          login({ email: userData.email, role: resultText });
          if (resultText === "Waiter") navigate("/waiter-dashboard");
          else if (resultText === "Chef") navigate("/chef-dashboard");
          else if (resultText === "Admin") navigate("/admin-dashboard");
        }
      } else {
        alert(resultText);
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  const roleColors = {
    Waiter: "primary",
    Chef: "success",
    Admin: "danger",
  };
  const roleColor = roleColors[role] || "secondary";

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <div className={`card-header bg-${roleColor} text-white text-center`}>
          <h4>{isSignup ? `Signup as ${role}` : `Login as ${role}`}</h4>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" style={{ color: "black" }}>Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: "black" }}>
                {isSignup ? "Create Password" : "Password"}
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button type="submit" className={`btn btn-${roleColor} w-100 mt-3`}>
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p style={{ color: "#333" }}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <span
                style={{ cursor: "pointer", fontWeight: "bold", color: `var(--bs-${roleColor})` }}
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Signup"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginWaiter() { return <LoginForm role="Waiter" />; }
export function LoginChef() { return <LoginForm role="Chef" />; }
export function LoginAdmin() { return <LoginForm role="Admin" />; }
export default LoginForm;



