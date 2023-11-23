import  { useState } from "react";
import "./Navbar.css";
import "boxicons/css/boxicons.min.css";
import Logo from "./Pages/assets/Logo.svg";

export const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <nav className={`nav ${menuVisible ? "active" : ""}`}>
      <div className="menu-toggle" onClick={toggleMenu}>
        <i
          className={`bx ${menuVisible ? "bx-x" : "bx bx-menu-alt-left"} icon`}
        ></i>
      </div>

      <a href="/" className="Logo">
        <img src={Logo} alt="Logo" />
      </a>

      <div className={`Search__Box ${menuVisible ? "hidden" : ""}`}>
        <div className="Search__Container">
          <div className="Search">
            <i className="bx bx-search icon"></i>
            <input type="text" placeholder="Search" />
          </div>
          <button className="Search__Button" type="button">
            Search
          </button>
        </div>
      </div>

      <ul className={`nav-links ${menuVisible ? "active" : ""}`}>
        <li>
          <a href="/Notification" className="icon-container">
            <i className="bx bx-bell icon"></i>
            <p className="Nav__Text">Notification</p>
          </a>
        </li>
        <li>
          <a href="/Wishlist" className="icon-container">
            <i className="bx bx-heart icon"></i>
            <p className="Nav__Text">Wishlist</p>
          </a>
        </li>
        <li>
          <a href="/cart" className="icon-container">
            <i className="bx bx-cart icon"></i>
            <p className="Nav__Text">Cart</p>
          </a>
        </li>
        <li>
          <a href="/Account" className="icon-container">
            <i className="bx bx-user icon"></i>
            <p className="Nav__Text">Profile</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};