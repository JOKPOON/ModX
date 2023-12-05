import React, { useEffect } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";

interface items {
  id: number;
  quantity: number;
  total: number;
  updated_at: string;
  status: string;
  is_reviewed: boolean;
}

export const Notification = () => {
  const navigate = useNavigate();
  const [Order, setOrder] = React.useState<items[] | null>(null);

  const handleGetOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Login";
      return;
    }

    await fetch("http://localhost:8080/v1/order/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((data) => {
          console.log(data);
          setOrder(data);
        });
      } else {
        setOrder(null);
      }

      if (res.status === 403) {
        window.location.href = "/Login";
      }
    });
  };

  useEffect(() => {
    handleGetOrder();
  }, []);

  const handleHistorygo = () => {};

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
      <div className="Order__Body" onClick={handleHistorygo}>
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
