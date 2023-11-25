import React from "react";
import { useState } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";

interface items {
  picture?: string;
  title: string;
}

const Wishlist: items[] = [
  {
    picture: "#00001",
    title: "Female Uniform From KMUTT Fear of Natacha 2nd",
  },
  {
    picture: "#00001",
    title: "Female Uniform From KMUTT Fear of Natacha 2nd",
  },
  {
    picture: "#00001",
    title: "Female Uniform From KMUTT Fear of Natacha 2nd",
  },
  {
    picture: "#00001",
    title: "Female Uniform From KMUTT Fear of Natacha 2nd",
  },
];

export const WishlistDropdown = () => {
  const navigate = useNavigate();

  const [dropdownWishActive, setDropdownWishActive] = useState(false);

  const handledropdownWishlistgo = () => {
    navigate("/Wishlist");
    setDropdownWishActive(!dropdownWishActive);
    // setMenuVisible(!menuVisible);
  };

  const handleProductgo = () => {
    navigate("/Product");
    setDropdownWishActive(!dropdownWishActive);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <div className="title">
          <span>Wishlist</span>
        </div>
        <div className="item_container">
          {Wishlist.map((item, index) => (
            <div className="dropdown_item_form">
              <React.Fragment key={index}>
                <div className="dropdown_line">
                  <div className="dropdown_item">
                    <div
                      className="dropdown_item_info"
                      onClick={handleProductgo}
                    >
                      <div className="dropdown_img">
                        <img src={Logo} className="dropdown_icon" />
                      </div>
                      <div className=".dropdown_info">
                        <p>
                          <span>{item.title}</span>
                        </p>
                      </div>
                    </div>
                    <div className="Deleted_Wish">
                      <i className="bx bxs-heart"></i>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            </div>
          ))}
        </div>
        <div className="show_all_container">
          <button onClick={handledropdownWishlistgo}>Show All Wishlists</button>
        </div>
      </div>
    </div>
  );
};
