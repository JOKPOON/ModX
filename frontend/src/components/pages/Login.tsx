import React, { useState } from "react";
import "./Login.css";
import userDatabase from "./userDatabase";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleRegister = () => {
    window.location.href = "/register";
  };

  const handleLogin = () => {
    const user = userDatabase.find((u) => u.username === username);

    if (user && user.password === password) {
      // Successful login
      console.log("Login successful");
      // You can redirect to another page or perform additional actions here
    } else {
      // Failed login
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Login</h1>
        <div className="login__inputContainer">
          <label className="login__label">Username</label>
          <input
            className="login__input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login__inputContainer">
          <label className="login__label">Password</label>
          <input
            className="login__input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="login__togglePassword"
            onClick={handleTogglePassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="login__error">{error}</div>
        <div className="login__buttonContainer">
          <button className="login__button" onClick={handleLogin}>
            Login
          </button>
          <button className="login__button" onClick={handleToggleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
