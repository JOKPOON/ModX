import React, { useEffect } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import { HandleGetOrderList } from "../../API/API";
import { ordersItems } from "../../Interface/Interface";

export const Notification = () => {
  const navigate = useNavigate();
  const [Order, setOrder] = React.useState<ordersItems[] | null>(null);

  useEffect(() => {
    HandleGetOrderList().then((res) => {
      if (res === "can't find token") {
        navigate("/Login");
      } else {
        setOrder(res);
      }
    });
  }, [navigate]);

  const noIteminHistory = () => {
    return (
      <div className="NoItem">
        <div className="NoItem__Text">No Item in History</div>
      </div>
    );
  }

  return (
    <div className="Track__Container">
      <div className="Track__Header">
        <div className="Title__Container">
          <div className="Title__Grid">Order ID</div>
          <div className="Title__Grid">Items</div>
          <div className="Title__Grid">Total Price</div>
          <div className="Title__Grid">Order Date</div>
          <div className="Title__Grid">Status</div>
        </div>
      </div>
      <div className="Order__Body" >
        {Order?.length === 0 ? noIteminHistory() : null}
        {Order?.map((item, index) => (
          <div
            className="Order__Container"
            key={index}
            onClick={() => {
              if (item.status === "complete" && !item.is_reviewed) {
                navigate("/Comment", { state: { orderID: item.id } });
              } else {
                navigate("/History", { state: { item: item } });
              }
            }}
          >
            <React.Fragment key={index}>
              <div className="Order__Grid">{item.id}</div>
              <div className="Order__Grid">{item.quantity}</div>
              <div className="Order__Grid">{item.total}THB</div>
              <div className="Order__Grid">{item.updated_at}</div>

              <div className="Order__Grid">
                <div
                  className={`${
                    item.status === "pending"
                      ? "Pending"
                      : item.status === "complete"
                      ? "Complete"
                      : "Shipping"
                  }`}
                >
                  {item.status === "complete" && !item.is_reviewed ? (
                    <div>review</div>
                  ) : (
                    <div>{item.status}</div>
                  )}
                </div>
              </div>
            </React.Fragment>
          </div>
        ))}
      </div>
    </div>
  );
};