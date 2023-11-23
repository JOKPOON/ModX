import React, { useState, useEffect } from "react";
import "./Login.css";
import userDatabase from "./userDatabase";
import Logo from "../assets/Logo.svg";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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

  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="main">
    <div className={`container ${isSignUp ? 'active' : ''}`}>
      <div className="form-container sign-in">
        <button className="Back">{'<'+'Back' }</button>
        <img src={Logo} alt="" className="LogoSVG"/>
      
        <form>
          <h1>Login</h1>
          <span></span>
          <input type="name" placeholder="Username"/>
          <input type="password" placeholder="Password"/>

          <button className="BtnTog">Login</button>
        </form>

      </div>
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
          <span></span>
          <input type="text" placeholder="Username"/>
          <input type="email" placeholder="Email"/>
          <input type="password" placeholder="Password"/>
          <input type="password" placeholder="Confirm Password"/>
          <button className="BtnTog" >Register</button>
        </form>
      </div>
      

      <div className="toggle-container">
        <div className="toggle">
          <div className={`toggle-panel toggle-left ${isSignUp ? 'hidden' : ''}`}>
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all site features</p>
            <button className="BtnTog" onClick={handleToggle}>Login</button>
          </div>
          <div className={`toggle-panel toggle-right ${isSignUp ? '' : 'hidden'}`}>
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all site features</p>
            <button className="BtnTog" onClick={handleToggle}>Register</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
