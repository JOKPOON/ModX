import React, { useEffect } from "react";
import { useState } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";

interface items {
  product_title?: string;
  product_image?: string;
}

export const WishlistDropdown = () => {
  const navigate = useNavigate();

  const [dropdownWishActive, setDropdownWishActive] = useState(false);
  const [Wishlist, setWishlist] = useState<items[] | null>(null);

  const handledropdownWishlistgo = () => {
    navigate("/Wishlist");
    setDropdownWishActive(!dropdownWishActive);
    // setMenuVisible(!menuVisible);
  };

  const handleProductgo = () => {
    navigate("/Product");
    setDropdownWishActive(!dropdownWishActive);
  };

  const handleGetWishList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Login";
      return;
    }

    await fetch("http://localhost:8080/v1/wishlist/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((data) => {
          console.log(data);
          setWishlist(data.products);
        });
      }

      if (res.status === 403) {
        window.location.href = "/Login";
      }
    });
  };

  useEffect(() => {
    handleGetWishList();
  }, []);

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <div className="title">
          <span>Wishlist</span>
        </div>
        <div className="item_container">
          <div className="dropdown_item_form">
            {Wishlist?.map((item, index) => (
              <React.Fragment key={index}>
                <div className="dropdown_line">
                  <div className="dropdown_item">
                    <div
                      className="dropdown_item_info"
                      onClick={handleProductgo}
                    >
                      <div className="dropdown_img">
                        <img
                          src={item.product_image}
                          className="dropdown_icon"
                        />
                      </div>
                      <div className=".dropdown_info">
                        <p>
                          <span>{item.product_title}</span>
                        </p>
                      </div>
                    </div>
                    <div className="Deleted_Wish">
                      <i className="bx bxs-heart"></i>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="show_all_container">
          <button onClick={handledropdownWishlistgo}>Show All Wishlists</button>
        </div>
      </div>
    </div>
  );
};
