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
  options: {
    [option: string]: string;
  };
}

export const Comment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state as { orderID: number };

  const [orderProducts, setOrderProducts] = useState<items[]>([]);

  const HandlegoBack = () => {
    navigate(-1);
  };

  const handleRatingClick = (rate: number, itemID: number) => {
    const updatedProducts = orderProducts.map((product) => {
      if (product.id === itemID) {
        product.rating = rate;
      }
      return product;
    });
    setOrderProducts(updatedProducts);
  };

  const RatingButton: React.FC<{
    rate: number;
    onClick: () => void | undefined;
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

  const handleCommentChange = (comment: string, itemId: number) => {
    const updatedProducts = orderProducts.map((product) => {
      if (product.id === itemId) {
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
      }

      window.location.reload();
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
          <span style={{ color: "#fefefe" }}>orderID : {order.orderID}</span>
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
            {orderProducts?.map((product) => {
              return (
                <div key={product.id}>
                  {!product.is_reviewed && (
                    <div className="Comment__Content" key={product.id}>
                      <div className="Comment__Top">
                        <div className="Commit__Picture__Container">
                          <div
                            className="Comment__Picture"
                            style={{
                              backgroundImage: `url(${product.picture})`,
                            }}
                          ></div>
                        </div>
                        <div className="Comment__Name">
                          <div className="Comment__Name">{product.title}</div>
                          <div className="Comment__Sub">
                            {product.options["option_1"]}
                          </div>
                          <div className="Comment__Sub">
                            {product.options["option_2"]}
                          </div>
                        </div>
                        <div className="Comment__Quantity">
                          {product.quantity}
                        </div>
                        <div className="Comment__Price">
                          {formatPrice(product.total)} THB
                        </div>
                      </div>
                      <div className="Comment__Bottom">
                        <div className="Comment__Rate">
                          {Array.from({ length: 5 }, (_, index) => (
                            <RatingButton
                              key={index}
                              rate={index + 1}
                              onClick={() =>
                                handleRatingClick(index + 1, product.id)
                              }
                              selectedRating={product.rating}
                            />
                          ))}
                        </div>
                        <div className="Comment__input">
                          <input
                            type="text"
                            placeholder="Comment"
                            value={product.comment}
                            onChange={(e) =>
                              handleCommentChange(e.target.value, product.id)
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
                  )}
                  {product.is_reviewed && (
                    <div className="Comment__Content" key={product.id}>
                      <div className="Comment__Top">
                        <div className="Commit__Picture__Container">
                          <div
                            className="Comment__Picture"
                            style={{
                              backgroundImage: `url(${product.picture})`,
                            }}
                          ></div>
                        </div>
                        <div className="Comment__Name">
                          <div className="Comment__Name">{product.title}</div>
                          <div className="Comment__Sub">
                            {product.options["option_1"]}
                          </div>
                          <div className="Comment__Sub">
                            {product.options["option_2"]}
                          </div>
                        </div>
                        <div className="Comment__Quantity">
                          {product.quantity}
                        </div>
                        <div className="Comment__Price">
                          {formatPrice(product.total)} THB
                        </div>
                      </div>
                      <div className="Comment__Bottom">
                        <div className="Comment__Rate">
                          {Array.from({ length: 5 }, (_, index) => (
                            <RatingButton
                              key={index}
                              rate={index + 1}
                              onClick={() => undefined}
                              selectedRating={product.rating}
                            />
                          ))}
                        </div>
                        <div className="Comment__input">
                          <input
                            type="text"
                            placeholder="Comment"
                            value={product.comment}
                            disabled
                          />
                        </div>
                        <button className="Comment__Button__Disabled">
                          Reviewed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
