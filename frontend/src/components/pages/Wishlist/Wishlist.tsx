import React, { useState } from "react";
import "./Wishlist.css";
import Clothes from "../assets/Clothes.svg";
import { useNavigate } from "react-router-dom";

interface items {
  picture?: string;
  title: string;
  price: number;
}

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState<items[]>([
    {
      picture: "#00001",
      title: "Female Uniform From KMUTT Fear of Natacha 2nd",
      price: 99999999,
    },
    {
      picture: "#00002",
      title: "Female Uniform From KMUTT Fear of Natacha 2nd",
      price: 99999999,
    },
    {
      picture: "#00002",
      title: "Female Uniform From KMUTT Fear of Natacha 2nd",
      price: 99999999,
    },
  ]);

  const removeFromWishlist = (index: number) => {
    const updatedWishlist = [...wishlist];
    updatedWishlist.splice(index, 1);
    setWishlist(updatedWishlist);
  };

  const navigate = useNavigate();

  const handleProductGo = () => {
    navigate("/Product");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="Order__Container">
      <div className="Header">
        <div className="WishTitle__Container">
          <div className="Title__BackIcon" onClick={handleGoBack}>
            <i className="bx bx-chevron-left"></i>
            <div className="Title__BackTitle">Back</div>
          </div>
        </div>
      </div>
      <div className="Wishlist__Container">
        <div className="Wishlist__Title">WISHLIST</div>
        {wishlist.map((items, index) => (
          <div className="Wishlist__Item">
            <React.Fragment key={index}>
              <div className="Item__Container">
                <div className="Item__Top">
                  <div className="Item__Picture">
                    <img src={Clothes} className="Item__Picture" />
                  </div>
                  <div className="Item__Title">{items.title}</div>
                  <div className="Price__Container">
                    <div className="Item__Price">
                      <div className="Item__PriceTHB">{items.price}</div>
                      <div className="Item__THB">THB</div>
                    </div>
                  </div>
                </div>
                <div className="Item__Bottom">
                  <div className="Item__Remover">
                    <button
                      className="Remove"
                      onClick={() => removeFromWishlist(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="Item__Viewer">
                    <button className="View" onClick={handleProductGo}>
                      Go to store
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          </div>
        ))}
      </div>
    </div>
  );
};
