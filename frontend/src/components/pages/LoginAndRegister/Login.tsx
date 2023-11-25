import { MouseEvent, useState } from "react";
import "./Login.css";
import Logo from "../assets/Logo.svg";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e: MouseEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8080/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((data) => {
          localStorage.setItem("token", data.token);
          console.log(data);
        });
        window.location.href = "/AllProducts";
      }
      throw new Error("Username or password is incorrect");
    });
  };

  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleResgister = async (e: MouseEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !email) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await fetch("http://localhost:8080/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((data) => {
          localStorage.setItem("token", data.token);
          console.log(data);
        });
        window.location.href = "/AllProducts";
      }
      throw new Error("Username already exists");
    });
  };

  return (
    <div className="main">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        <div className="form-container sign-in">
          <button className="Back">{"<" + "Back"}</button>
          <img src={Logo} alt="" className="LogoSVG" />

          <form>
            <h1>Login</h1>
            <span></span>
            <input
              type="name"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="BtnTog"
              onClick={(e) => {
                handleLogin(e);
              }}
            >
              Login
            </button>
          </form>
        </div>
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <span></span>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <button className="BtnTog" onClick={handleResgister}>
              Register
            </button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div
              className={`toggle-panel toggle-left ${isSignUp ? "hidden" : ""}`}
            >
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <button className="BtnTog" onClick={handleToggle}>
                Login
              </button>
            </div>
            <div
              className={`toggle-panel toggle-right ${
                isSignUp ? "" : "hidden"
              }`}
            >
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all site features
              </p>
              <button className="BtnTog" onClick={handleToggle}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
