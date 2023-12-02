import React, { useEffect } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";

interface items {
  id: number;
  quantity: number;
  total: number;
  updated_at: string;
  status: string;
}

export const Notification = () => {
  const navigate = useNavigate();
  const [Order, setOrder] = React.useState<items[]>([]);

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
      }

      if (res.status === 403) {
        window.location.href = "/Login";
      }
    });
  };

  useEffect(() => {
    handleGetOrder();
  }, []);

  const handleHistorygo = () => {
    navigate("/History");
  };

  return (
    <div className="Track__Container">
      <div className="Track__Header">
        <div className="Title__Container">
          <div className="Title__Grid1">Order ID</div>
          <div className="Title__Grid2">Items</div>
          <div className="Title__Grid3">Total Price</div>
          <div className="Title__Grid4">Order Date</div>
          <div className="Title__Grid5">Status</div>
        </div>
      </div>
      <div className="Order__Body" onClick={handleHistorygo}>
        {Order.map((item, index) => (
          <div className="Order__Container" key={index}>
            <React.Fragment key={index}>
              <div className="Order__Grid1">{item.id}</div>
              <div className="Order__Grid2">{item.quantity}</div>
              <div className="Order__Grid3">{item.total}THB</div>
              <div className="Order__Grid4">{item.updated_at}</div>
              <div className="Order__Grid5">
                <div
                  className={`${
                    item.status === "Pending"
                      ? "Pending"
                      : item.status === "Complete"
                      ? "Complete"
                      : "Shipping"
                  }`}
                >
                  {item.status}
                </div>
              </div>
            </React.Fragment>
          </div>
        ))}
      </div>
    </div>
  );
};
