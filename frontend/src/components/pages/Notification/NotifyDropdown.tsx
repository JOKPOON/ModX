import React, { useEffect } from "react";
import { useState } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { HandleGetOrderList } from "../../API/API";
import { ordersItems } from "../../Interface/Interface";

export const NotifyDropdown = () => {
  const navigate = useNavigate();
  const [dropdownNotiActive, setDropdownNotiActive] = useState(false);
  const [Notification, setOrder] = React.useState<ordersItems[] | null>(null);

  useEffect(() => {
    HandleGetOrderList().then((res) => {
      setOrder(res);
    });
  }, []);

  const handledropdownNotigo = () => {
    navigate("/History");
    setDropdownNotiActive(!dropdownNotiActive);
    // setMenuVisible(!menuVisible);
  };

  const handleOrdergo = () => {
    navigate("/Order");
    setDropdownNotiActive(!dropdownNotiActive);
  };

  const compaerTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    const diffHours = Math.ceil(diff / (1000 * 3600));
    const diffMins = Math.ceil(diff / (1000 * 60));
    const diffSec = Math.ceil(diff / 1000);

    if (diffDays > 0) {
      return `${diffDays} วันที่แล้ว`;
    } else if (diffHours > 0) {
      return `${diffHours} ชั่วโมงที่แล้ว`;
    } else if (diffMins > 0) {
      return `${diffMins} นาทีที่แล้ว`;
    } else if (diffSec > 0) {
      return `${diffSec} วินาทีที่แล้ว`;
    }
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <div className="title">
          <span>Notification</span>
        </div>
        <div className="item_container">
          {Notification?.map((item, index) => (
            <div className="dropdown_item_form" key={index}>
              <React.Fragment key={index}>
                <div className="dropdown_item">
                  <div className="dropdown_item_info" onClick={handleOrdergo}>
                    <div className="dropdown_img">
                      <img src={Logo} className="dropdown_icon" />
                    </div>
                    <div className="dropdown_info">
                      <p>
                        <span>Order{item.id}</span>
                        {`${
                          item.status === "Pending"
                            ? "อยู่ระหว่างขั้นตอนรอการดำเนินการจัดส่ง"
                            : item.status === "Complete"
                            ? "ได้ถูกจัดส่งสำเร็จแล้ว"
                            : "อยู่ระหว่างการจัดส่ง"
                        }`}
                      </p>
                      <div className="dropdown_Time">
                        <p>{compaerTime(item.updated_at)}</p>
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
