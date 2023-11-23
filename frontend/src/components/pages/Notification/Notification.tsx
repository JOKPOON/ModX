import React from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";

interface items {
  orderID: string;
  quantity: number;
  price: number;
  date: string;
  status: string;
}

const Order: items[] = [
  {
    orderID: "#00001",
    quantity: 1,
    price: 99999999,
    date: "12/12/2023",
    status: "Shipping",
  },
  {
    orderID: "#00002",
    quantity: 4,
    price: 99999999,
    date: "17/12/2023",
    status: "Pending",
  },
  {
    orderID: "#00003",
    quantity: 2,
    price: 99999999,
    date: "17/12/2023",
    status: "Pending",
  },
  {
    orderID: "#00004",
    quantity: 1,
    price: 99999999,
    date: "20/12/2023",
    status: "Complete",
  },
];


export const Notification = () => {

  const navigate = useNavigate();

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
          <div className="Order__Container">
            <React.Fragment key={index}>
              <div className="Order__Grid1">{item.orderID}</div>
              <div className="Order__Grid2">{item.quantity}</div>
              <div className="Order__Grid3">{item.price}THB</div>
              <div className="Order__Grid4">{item.date}</div>
              <div className="Order__Grid5">
                <div className={`${item.status === 'Pending' ? 'Pending' : item.status === 'Complete' ? 'Complete' : 'Shipping'}`}>
                  {item.status}</div>
              </div>
            </React.Fragment>
          </div>
        ))}
      </div>

    </div>
  );
};
