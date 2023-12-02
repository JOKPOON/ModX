import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";

interface items {
  id: number;
  product_id?: number;
  product_image?: string;
  product_title: string;
  price: number;
}

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState<items[]>([]);

  const removeFromWishlist = (index: number) => {
    handleDeleteWishList(index);

    const newWishlist = [...wishlist];
    newWishlist.splice(index, 1);
    setWishlist(newWishlist);
  };

  const navigate = useNavigate();

  const handleProductGo = (item: items) => {
    item.id = item.product_id ?? 0;
    navigate("/SingleProduct", { state: { item: item } });
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

    await fetch("http://localhost:8080/v1/wishlist/", {
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

  const handleDeleteWishList = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Login";
      return;
    }

    await fetch(`http://localhost:8080/v1/wishlist/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        await handleGetWishList();
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
                      onClick={() => removeFromWishlist(items.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="Item__Viewer">
                    <button
                      className="View"
                      onClick={() => {
                        handleProductGo(items);
                      }}
                    >
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
