import React from "react";
import { useState } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";

interface items {
  orderID: string;
  status: string;
  time: string;
}

const Notification: items[] = [
  {
    orderID: "#00001",
    status: "Shipping",
    time: "50 minutes ago",
  },
  {
    orderID: "#00002",
    status: "Pending",
    time: "1 hour ago",
  },
  {
    orderID: "#00003",
    status: "Pending",
    time: "2 hours ago",
  },
  {
    orderID: "#00004",
    status: "Complete",
    time: "2 days ago",
  },
];

export const NotifyDropdown = () => {
  const navigate = useNavigate();

  const [dropdownNotiActive, setDropdownNotiActive] = useState(false);

  const handledropdownNotigo = () => {
    navigate("/Notification");
    setDropdownNotiActive(!dropdownNotiActive);
    // setMenuVisible(!menuVisible);
  };

  const handleOrdergo = () => {
    navigate("/Order");
    setDropdownNotiActive(!dropdownNotiActive);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <div className="title">
          <span>Notification</span>
        </div>
        <div className="item_container">
          {Notification.map((item, index) => (
            <div className="dropdown_item_form">
              <React.Fragment key={index}>
                <div className="dropdown_item">
                  <div className="dropdown_item_info" onClick={handleOrdergo}>
                    <div className="dropdown_img">
                      <img src={Logo} className="dropdown_icon" />
                    </div>
                    <div className="dropdown_info">
                      <p>
                        <span>Order{item.orderID}</span>
                        {`${
                          item.status === "Pending"
                            ? "อยู่ระหว่างขั้นตอนรอการดำเนินการจัดส่ง"
                            : item.status === "Complete"
                            ? "ได้ถูกจัดส่งสำเร็จแล้ว"
                            : "อยู่ระหว่างการจัดส่ง"
                        }`}
                      </p>
                      <div className="dropdown_Time">
                        <p>{item.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="Deleted_Noti">
                    <i className="bx bx-trash"></i>
                  </div>
                </div>
              </React.Fragment>
              <div></div>
            </div>
          ))}
        </div>
        <div className="show_all_container">
          <button onClick={handledropdownNotigo}>Show All Notificaions</button>
        </div>
      </div>
    </div>
  );
};
