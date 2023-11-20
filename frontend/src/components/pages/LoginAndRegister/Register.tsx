import React, { useState } from "react";
import "./Login.css";
import userDatabase from "./userDatabase";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const existingUser = userDatabase.find((u) => u.username === username);

    if (existingUser) {
      setError("Username already exists");
      return;
    }

    const newUser = { username, password };
    userDatabase.push(newUser);

    console.log("Registration successful", newUser);
  };

  return (
    <div>
      <h2>Register</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handleRegister}>Register</button>
      <p>{error}</p>
    </div>
  );
};
