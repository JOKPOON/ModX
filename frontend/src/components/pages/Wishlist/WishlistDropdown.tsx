import React, { useEffect } from "react";
import { useState } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import { wishlistItems } from "../../Interface/Interface";
import { HandleGetWishList } from "../../API/API";

export const WishlistDropdown = () => {
  const navigate = useNavigate();

  const [dropdownWishActive, setDropdownWishActive] = useState(false);
  const [Wishlist, setWishlist] = useState<wishlistItems[]>([]);

  const handledropdownWishlistgo = () => {
    navigate("/Wishlist");
    setDropdownWishActive(!dropdownWishActive);
    // setMenuVisible(!menuVisible);
  };

  const handleProductgo = (item: wishlistItems) => {
    setDropdownWishActive(!dropdownWishActive);
    item.id = item.product_id ?? 0;
    navigate("/SingleProduct", { state: { item: item } });
  };

  useEffect(() => {
    HandleGetWishList().then((res) => {
      setWishlist(res);
    });
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
                      key={index}
                      className="dropdown_item_info"
                      onClick={() => {
                        handleProductgo(item);
                      }}
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
