import { useState } from "react";
import "./Account.css";
import EyeIcon from "../assets/EyeIcon.svg";
import { useNavigate } from "react-router-dom";

interface Props {
  username: string;
  password: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  postID?: number;
}

const userDatabase: Props[] = [
  {
    username: "User12345",
    password: "Password12345",
    email: "Test@gmail.com",
    name: "Harry Potter",
    phoneNumber: "0123456789",
    address: "Hogwarts",
    country: "England",
    city: "London",
    state: "",
  },
];

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
    navigate("/");
  };

  const [show, setShow] = useState(false);

  const handleTogglePassword = () => {
    setShow(!show);
  };

  //Save Profile
  const handdleSaveProfile = () => {
    console.log(userData);
    alert("Save Profile");
  };

  //User Data
  const [userData, setUserData] = useState<Props>(userDatabase[0]);

  /*
    In placeholder, if User Data is not null, show User Data
    else show placeholder text
  */

  return (
    <div className="main">
      <div className="Container">
        <button className="Back-Account" onClick={HandleBackButton}>
          {"<" + "Back"}
        </button>
        <div className="Head">Your Profile</div>
        <div className="Form-Container">
          <div className="One-Form">
            <h4>Username</h4>
            <input
              type="text"
              placeholder="Username"
              value={userDatabase[0].username}
              readOnly
            />
          </div>
          <div className="One-Form Password">
            <h4>Password</h4>
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={userDatabase[0].password}
              readOnly
            />
          </div>
          <button className="EyeIcon" onClick={handleTogglePassword}>
            <img src={EyeIcon} alt="EyeIcon" className="EyeSVG" />
          </button>

          <div className="One-Form-Long">
            <h4>Email</h4>
            <input
              type="email"
              placeholder="HarrypotterHogwarts@gmail.com"
              value={userDatabase[0].email}
              readOnly
            />
          </div>

          <div className="One-Form">
            <h4>Name</h4>
            <input
              type="text"
              placeholder={userDatabase[0].name ? userDatabase[0].name : "Name"}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>
          <div className="One-Form">
            <h4>Phone Number</h4>
            <input
              type="tel"
              placeholder={
                userDatabase[0].phoneNumber
                  ? userDatabase[0].phoneNumber
                  : "9876543210"
              }
              maxLength={10}
              onChange={(e) =>
                setUserData({ ...userData, phoneNumber: e.target.value })
              }
            />
          </div>

          <div className="One-Form-Long">
            <h4>Address</h4>
            <input
              type="text"
              placeholder={
                userDatabase[0].address ? userDatabase[0].address : "Address"
              }
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="text"
              placeholder={
                userDatabase[0].country ? userDatabase[0].country : "Country"
              }
              onChange={(e) =>
                setUserData({ ...userData, country: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="text"
              placeholder={userDatabase[0].city ? userDatabase[0].city : "City"}
              onChange={(e) =>
                setUserData({ ...userData, city: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="text"
              placeholder={
                userDatabase[0].state ? userDatabase[0].state : "State"
              }
              onChange={(e) =>
                setUserData({ ...userData, state: e.target.value })
              }
            />
          </div>
          <div className="One-Form-Short">
            <input
              type="number"
              placeholder={
                userDatabase[0].postID
                  ? userDatabase[0].postID.toString()
                  : "123456"
              }
              onChange={(e) =>
                setUserData({ ...userData, postID: Number(e.target.value) })
              }
            />
          </div>
          <div className="Row">
            <button className="Small-Button" onClick={openPopup}>
              Delete Account
            </button>
            <button className="Small-Button">Order History</button>
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
