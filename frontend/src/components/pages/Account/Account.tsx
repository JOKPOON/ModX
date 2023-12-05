import { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import { userDetails, shippingDetails } from "../../Interface/Interface";
import {
  HandleGetUserData,
  HandleDeleteAccount,
  HandleUpdateShipping,
} from "../../API/API";

//Account Page Component
export const Account = () => {
  const navigate = useNavigate();

  //Back Button to back to previous page
  const HandleBackButton = () => {
    navigate(-1);
  };

  const [isActive, setIsActive] = useState(false);
  const openPopup = () => {
    setIsActive(true);
  };

  const closePopup = () => {
    setIsActive(false);
  };

  //Delete Account and navigate to Home Page
  const deleteAccount = () => {
    console.log("Delete Account");
    HandleDeleteAccount();
  };

  //Save Profile
  const handdleSaveProfile = () => {
    console.log(userData);
    console.log(shippingData);
    if (shippingData) {
      HandleUpdateShipping(shippingData);
    }
    alert("Save Profile");
  };

  //User Data
  const [userData, setUserData] = useState<userDetails>();
  const [shippingData, setShippingData] = useState<shippingDetails>();

  useEffect(() => {
    HandleGetUserData().then((res) => {
      setUserData(res.userData);
      setShippingData(res.shippingData);
    });
  }, []);

  /*
    In placeholder, if User Data is not null, show User Data
    else show placeholder text
  */

  return (
    <div className="main">
      <div className="Conta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          iner">
        <button className="Back-Account" onClick={HandleBackButton}>
          {"<" + "Back"}
        </button>
        <div className="Head">Your Profile</div>
        <div className="Form-Container">
          <div className="One-Form-Long">
            <h4>Username</h4>
            <input
              type="text"
              placeholder="Username"
              value={userData?.username}
              readOnly
            />
          </div>

          <div className="One-Form-Long">
            <h4>Email</h4>
            <input
              type="email"
              placeholder="HarrypotterHogwarts@gmail.com"
              value={userData?.email}
              readOnly
            />
          </div>

          <div className="One-Form">
            <h4>Name</h4>
            <input
              type="text"
              placeholder={shippingData?.name ? shippingData?.name : "Name"}
              onChange={(e) =>
                setShippingData({ ...shippingData, name: e.target.value })
              }
            />
          </div>
          <div className="One-Form">
            <h4>Phone Number</h4>
            <input
              type="tel"
              placeholder={
                shippingData?.tel ? shippingData?.tel : "Phone Number"
              }
              maxLength={10}
              onChange={(e) =>
                setShippingData({
                  ...shippingData,
                  tel: e.target.value,
                })
              }
            />
          </div>

          <div className="One-Form-Long">
            <h4>Address</h4>
            <input
              type="text"
              placeholder={shippingData?.addr ? shippingData?.addr : "Address"}
              onChange={(e) =>
                setShippingData({ ...shippingData, addr: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="text"
              placeholder={
                shippingData?.province ? shippingData?.province : "Country"
              }
              onChange={(e) =>
                setShippingData({ ...shippingData, province: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="text"
              placeholder={
                shippingData?.district ? shippingData?.district : "City"
              }
              onChange={(e) =>
                setShippingData({ ...shippingData, district: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="text"
              placeholder={
                shippingData?.sub_dist ? shippingData?.sub_dist : "State"
              }
              onChange={(e) =>
                setShippingData({ ...shippingData, sub_dist: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="number"
              placeholder={
                shippingData?.zip ? shippingData?.zip.toString() : "Post ID"
              }
              onChange={(e) =>
                setShippingData({
                  ...shippingData,
                  zip: e.target.valueAsNumber,
                })
              }
            />
          </div>
          <div className="Row">
            <button className="Small-Button" onClick={openPopup}>
              Delete Account
            </button>
            <button
              className="Small-Button"
              onClick={() => {
                navigate("/History");
              }}
            >
              Order History
            </button>
          </div>
          <button className="Save-Button" onClick={handdleSaveProfile}>
            Save Profile
          </button>
        </div>
        {isActive && (
          <div className="popup open-popup">
            <div className="popup-content">
              <h2>Delete Account</h2>
              <p>Are you sure you want to delete your account?</p>
              <div className="Row">
                <button className="Small-Button White" onClick={closePopup}>
                  Cancel
                </button>
                <button className="Small-Button" onClick={deleteAccount}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
