import  { useState, useEffect} from "react";
import "./Navbar.css";
import "boxicons/css/boxicons.min.css";
import Logo from "./Pages/assets/Logo.svg";
import { NotifyDropdown } from "./pages/Notification/NotifyDropdown";

export const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const [dropdownNotiActive, setDropdownNotiActive] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  const updateIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener('resize', updateIsMobile);

  useEffect(() => {
    updateIsMobile();

    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  
  const handledropdownNotiClick = () => {
    setDropdownNotiActive(!dropdownNotiActive)
  }

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
      <div
            className={`icon-wrapper ${
              isMobile ? "mobile-mode" : "deskop-mode"
            }`}
          >
            {isMobile ? (
              <a href="/Notification" className="icon-container">
                  <i className="bx bx-bell icon"></i>
                  <p className="Nav__Text">Notification</p>
              </a>
            ) : (
              <div className="dropdown-block" onClick={handledropdownNotiClick}>
                <div className="icon-container">
                  <div className="button">
                    <i className="bx bx-bell icon"></i>
                  </div>
                </div>
                {dropdownNotiActive && <NotifyDropdown />}
              </div>
            )}
          </div>
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