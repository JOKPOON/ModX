import "./Comment.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPrice } from "../Helper/Calculator";

interface items {
  id: number;
  item_id: number;
  title: string;
  total: number;
  picture?: string;
  product_id: number;
  quantity?: number;
  rating: number | null;
  comment?: string;
  is_reviewed?: boolean;
}

export const Comment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state as { orderID: number };
  const MockupOrderID = order ? order.orderID : 0;

  const [orderProducts, setOrderProducts] = useState<items[]>([]);

  const HandlegoBack = () => {
    navigate(-1);
  };

  const handleRatingClick = (rate: number, itemID: number) => {
    const updatedProducts = orderProducts.map((product) => {
      if (product.product_id === itemID) {
        product.rating = rate;
      }
      return product;
    });
    setOrderProducts(updatedProducts);
  };

  const RatingButton: React.FC<{
    rate: number;
    onClick: () => void;
    selectedRating: number | null;
  }> = ({ rate, onClick, selectedRating }) => {
    return (
      <div className="Commet__Star">
        <i
          className="bx bxs-star icon AllProducts__Categories__Rating__Star"
          style={{
            color: rate <= (selectedRating ?? 0) ? "#ff6e1f" : "#8F8F8F",
            cursor: "pointer",
          }}
          onClick={onClick}
        ></i>
      </div>
    );
  };

  const handleCommentChange = (
    comment: string,
    productId: number,
    itemId: number
  ) => {
    const updatedProducts = orderProducts.map((product) => {
      if (product.product_id === productId) {
        product.comment = comment;
        product.item_id = itemId;
      }
      return product;
    });
    setOrderProducts(updatedProducts);
    console.log(updatedProducts);
  };

  const HandleReviewClick = (product_id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Login";
      return;
    }

    const reviewData = orderProducts.filter((product) => {
      return product.product_id === product_id;
    });

    console.log(reviewData);

    fetch("http://localhost:8080/v1/product/review", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData[0]),
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((data) => {
          console.log(data);
          alert("Review Success");
        });

        const newOrder = orderProducts.filter((product) => {
          return product.product_id !== reviewData[0]?.product_id;
        });

        setOrderProducts(newOrder);
      }
    });
  };

  useEffect(() => {
    const handleGetOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/Login";
        return;
      }

      await fetch(`http://localhost:8080/v1/order/${order.orderID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (res.ok) {
          await res.json().then((data) => {
            console.log(data);
            setOrderProducts(data);
          });
        }

        if (res.status === 403) {
          window.location.href = "/Login";
        }
      });
    };

    handleGetOrder();
  }, [order]);

  return (
    <div>
      <div className="Comment__Container">
        <div className="Comment__Back">
          <button onClick={HandlegoBack}>&lt;Back</button>
          <span style={{ color: "#fefefe" }}>orderID : {MockupOrderID}</span>
        </div>

        <div className="Comment__Topic">
          <div className="Comment__Topic__Text">
            <div className="Comment__Grid"></div>
            <div className="Comment__Grid">Product Name</div>
            <div className="Comment__Grid">Quantity</div>
            <div className="Comment__Grid">Price</div>
          </div>
        </div>
        <div className="Comment__Container__Content">
          <div className="Comment__Box">
            {orderProducts.map((product) =>
              !product.is_reviewed ? (
                <div className="Comment__Content" key={product.product_id}>
                  <div className="Comment__Top">
                    <div className="Commit__Picture__Container">
                      <div
                        className="Comment__Picture"
                        style={{ backgroundImage: `url(${product.picture})` }}
                      ></div>
                    </div>
                    <div className="Comment__Name">{product.title}</div>
                    <div className="Comment__Quantity">{product.quantity}</div>
                    <div className="Comment__Price">
                      {formatPrice(product.total)} THB
                    </div>
                  </div>
                  <div className="Comment__Bottom">
                    <div className="Comment__Rate">
                      <RatingButton
                        rate={1}
                        onClick={() => handleRatingClick(1, product.product_id)}
                        selectedRating={product.rating}
                      />
                      <RatingButton
                        rate={2}
                        onClick={() => handleRatingClick(2, product.product_id)}
                        selectedRating={product.rating}
                      />
                      <RatingButton
                        rate={3}
                        onClick={() => handleRatingClick(3, product.product_id)}
                        selectedRating={product.rating}
                      />
                      <RatingButton
                        rate={4}
                        onClick={() => handleRatingClick(4, product.product_id)}
                        selectedRating={product.rating}
                      />
                      <RatingButton
                        rate={5}
                        onClick={() => handleRatingClick(5, product.product_id)}
                        selectedRating={product.rating}
                      />
                    </div>
                    <div className="Comment__input">
                      <input
                        type="text"
                        placeholder="Comment"
                        value={product.comment}
                        onChange={(e) =>
                          handleCommentChange(
                            e.target.value,
                            product.product_id,
                            product.id
                          )
                        }
                      />
                    </div>
                    <button
                      className="Comment__Button"
                      onClick={() => {
                        HandleReviewClick(product.product_id);
                      }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="Comment__Top">Product is already review</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
