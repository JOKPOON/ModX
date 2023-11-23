import  { useState, useEffect} from "react";
import "./Navbar.css";
import "boxicons/css/boxicons.min.css";
import Logo from "./Pages/assets/Logo.svg";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handledropdownNotigo = () => {
    navigate("/Notification");
    setDropdownNotiActive(!dropdownNotiActive)
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
          <div className="dropdown-container">
            <div className={`icon-wrapper ${isMobile ? 'mobile-mode' : 'deskop-mode'}`}>
              {isMobile ? (
                <div className="icon-container" onClick={handledropdownNotigo}>
                  <div className="button">
                    <i className="bx bx-bell icon"></i>
                    <p className="Nav__Text">Notification</p>
                  </div>
                </div>
              ) : (
                <div className="icon-container" onClick={handledropdownNotiClick}>
                  <div className="button">
                    <i className="bx bx-bell icon"></i>
                    <p className="Nav__Text">Notification</p>
                  </div>
                </div>
              )}
            </div>
            <div className={`dropdown ${dropdownNotiActive ? "active" : ""}`}>
              <div className="title">
                <span>Notification</span>
              </div>
              <div className="item_container">
                <div className="dropdown_item">
                  <div className="dropdown_img">
                    <img src={Logo} className="dropdown_icon" />
                  </div>
                  <div className="dropdown_info">
                    <p>
                      <span>ชุดนักศึกษา</span> ที่อยู่ใน Wishlist ตอนนี้มีของแล้ว
                    </p>
                    <span className="dropdown_time">10 minutes ago</span>
                  </div>
                </div>
                <div className="dropdown_item">
                  <div className="dropdown_img">
                    <img src={Logo} className="dropdown_icon" />
                  </div>
                  <div className="dropdown_info">
                    <p>
                      <span>Ipad Case</span> ขณะนี้ได้ถูกจัดส่งแล้วเป็นที่เรียบร้อย
                    </p>
                    <span className="dropdown_time">55 minutes ago</span>
                  </div>
                </div>
                <div className="dropdown_item">
                  <div className="dropdown_img">
                    <img src={Logo} className="dropdown_icon" />
                  </div>
                  <div className="dropdown_info">
                    <p>
                      <span>กระติกน้ำ kmutt</span> ที่คุณถูกใจกำลังลดราคา 10%!!
                    </p>
                    <span className="dropdown_time">1 hours ago</span>
                  </div>
                </div>
                <div className="dropdown_item">
                  <div className="dropdown_img">
                    <img src={Logo} className="dropdown_icon" />
                  </div>
                  <div className="dropdown_info">
                    <p>
                      <span>หนังสือ</span> ที่คุณถูกใจกำลังลดราคา 20%!!
                    </p>
                    <span className="dropdown_time">2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="show_all_container">
                <button onClick={handledropdownNotigo}>Show All Notificaions</button>
              </div>
            </div>
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