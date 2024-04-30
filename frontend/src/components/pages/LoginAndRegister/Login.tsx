import { useState } from "react";
import "./Login.css";
import Logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const HandleLogin = async (username: string, password: string) => {
    await fetch("v1/auth/login", {
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
          navigate(-1);
        });
      } else {
        alert("Invalid Username or Password");
      }
    });
  };

  const HandleResgister = async (
    username: string,
    password: string,
    confirmPassword: string,
    email: string
  ) => {
    if (!username || !password || !confirmPassword || !email) {
      alert("All fields are required");
      return;
    }

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      alert("Email is invalid");
      return;
    }

    console.log(password, confirmPassword);
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await fetch("v1/users", {
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
          navigate(-1);
        });
      } else {
        alert("Duplicate Username or Email");
      }
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
              id="login_username"
              type="name"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              id="login_password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="BtnTog"
              onClick={(e) => {
                e.preventDefault();
                HandleLogin(username, password);
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
              id="username"
              type="text"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              id="email"
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <button
              className="BtnTog"
              onClick={(e) => {
                e.preventDefault();
                HandleResgister(username, password, confirmPassword, email);
              }}
            >
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
