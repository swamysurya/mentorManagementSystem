import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/axios";
import ToastContainer from "../components/ToastContainer";
import "../assets/styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const addMessage = (text, type = "error") => {
    const id = Date.now();
    setMessages((prev) => {
      // Keep only the last 3 messages
      const newMessages = [...prev, { id, text, type }];
      if (newMessages.length > 3) {
        return newMessages.slice(-3);
      }
      return newMessages;
    });
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const validateForm = () => {
    if (!email && !password) {
      addMessage("Email and password are required");
      return false;
    }
    if (!email) {
      addMessage("Email is required");
      return false;
    }
    if (!password) {
      addMessage("Password is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.status === "success") {
        const { token } = res.data.data;
        login(token, res.data.data.user.role);

        // Navigate based on role
        if (res.data.data.user.role === "RP") {
          navigate("/admin");
        } else {
          navigate("/mentor");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: err.response?.data?.message || "Login failed",
          type: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Email address"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="loading-text">Signing in...</span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
      <ToastContainer messages={messages} removeMessage={removeMessage} />
    </div>
  );
}
