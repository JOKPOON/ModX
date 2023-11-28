import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";

interface items {
  product_image?: string;
  product_title: string;
  price: number;
}

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState<items[]>([]);

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
                    <img src={items.product_image} className="Item__Picture" />
                  </div>
                  <div className="Item__Title">{items.product_title}</div>
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
