import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./loadingindicator";
import "../styles/Form.css";

export default function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLogin = method === "login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await api.post(route, { username, password });
            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (err) {
            const data = err.response?.data;
            let message = err.message;
            if (data) {
                if (data.detail) {
                    message = data.detail;
                } else {
                    message = Object.values(data).flat().filter(v => typeof v === 'string').join(" ");
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-brand">Notes</div>
                <div className="form-header">
                    <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
                    <p className="form-subtitle">
                        {isLogin ? "Sign in to your account" : "Start taking notes today"}
                    </p>
                </div>
                {error && <p className="form-error">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                />
                {loading && <LoadingIndicator />}
                <button type="submit" disabled={loading}>
                    {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                </button>
                <p className="form-switch">
                    {isLogin ? (
                        <>Don't have an account? <Link to="/register">Sign up</Link></>
                    ) : (
                        <>Already have an account? <Link to="/login">Sign in</Link></>
                    )}
                </p>
            </form>
        </div>
    );
}
