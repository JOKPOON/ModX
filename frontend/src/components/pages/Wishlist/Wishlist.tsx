import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import { wishlistItems } from "../../Interface/Interface";
import {
  HandleGetWishList,
  HandleDeleteWishList,
  CheckToken,
} from "../../API/API";

export const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<wishlistItems[] | null>(null);

  const removeFromWishlist = (index: number) => {
    HandleDeleteWishList(index).then((res) => {
      setWishlist(res);
    });

    const newWishlist = [...(wishlist ?? [])];
    newWishlist.splice(index, 1);
    setWishlist(newWishlist);
  };

  const handleProductGo = (item: wishlistItems) => {
    item.id = item.product_id ?? 0;
    navigate("/SingleProduct", { state: { item: item } });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    CheckToken()
      ? HandleGetWishList().then((res) => {
          setWishlist(res);
        })
      : navigate("/Login");
  }, [navigate]);

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
        {wishlist &&
          wishlist.map((items, index) => (
            <div className="Wishlist__Item" key={index}>
              <React.Fragment key={index}>
                <div className="Item__Container">
                  <div className="Item__Top">
                    <div className="Item__Picture">
                      <img
                        src={items.product_image}
                        className="Item__Picture"
                      />
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
