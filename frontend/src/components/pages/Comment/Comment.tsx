import "./Comment.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPrice } from "../Helper/Calculator";
import { HandleReviewClick, HandleGetOrder } from "../../API/API";
import { reviewItems } from "../../Interface/Interface";

export const Comment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state as { orderID: number };
  const [orderProducts, setOrderProducts] = useState<reviewItems[]>([]);
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

  useEffect(() => {
    HandleGetOrder(order.orderID).then((data) => {
      console.log(data);
      setOrderProducts(data);
    });
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
                            HandleReviewClick(product.id, orderProducts);
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
