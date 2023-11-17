import React from "react";
import "./Cart.css";
import { useState } from "react";

interface items {
  picture?: string;
  name: string;
  price: number;
}

interface Address {
  name: string;
  Adr: string;
  District: string;
  Province: string;
  Zip: string;
  Tel: string;
}

const AddressData: Address[] = [
  {
    name: "Pongsakorn Jansanit",
    Adr: "452 454 D2 Residence",
    District: "Thungkru",
    Province: "Bangkok",
    Zip: "10140",
    Tel: "0620546629",
  },
];

const CartProducts: items[] = [
  {
    picture:
      "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
    name: "เข็มขัดผู้ชาย สำหรับนักศึกษาชาย",
    price: 99459,
  },
  {
    picture:
      "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
    name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
    price: 960,
  },
  {
    picture:
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
    price: 99,
  },
];

export const Cart = () => {
  const [currentAddress] = useState(AddressData[0]);

  const handleChangeAddress = () => {
    console.log("Change Address Clicked");
  };

  const handleToggleCart = () => {
    console.log("toggle");
  };

  return (
    <div className="Cart__Container">
      <div className="Cart__Header">
        <div className="Cart__Header__Left">Items in your cart</div>
        <div className="Cart__Header__Right">
          <button className="Cart__Edit__Address">Select All</button>
          <div className="Cart__Gap"></div>
          <button className="Cart__Edit__Address">Delete</button>
        </div>
      </div>
      <div className="Cart__Body">
        <div className="Cart__Left">
          {CartProducts.map((product, index) => (
            <div className="Cart__Left__Container">
              <div className="Cart__Left__Grid1">
                <button
                  className="Cart__select__Togggle"
                  onClick={handleToggleCart}
                >
                  <i className="bx bx-check icon"></i>
                </button>
              </div>
              <React.Fragment key={index}>
                <div
                  className="Cart__Left__Grid2"
                  style={{ backgroundImage: `url(${product.picture})` }}
                ></div>
                <div className="Cart__Left__Grid3">{product.name}</div>
                <div className="Cart__Left__Grid4">box</div>
                <div className="Cart__Left__Grid5">
                  {product.price} <br></br>THB
                </div>
              </React.Fragment>{" "}
            </div>
          ))}
          <div className="Cart__Left__Button"> Shop More Item</div>
        </div>
        <div className="Cart__Right">
          <div className="Cart__Right__Container">
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">items(5)</div>
              <div className="Cart__text__Right__Content">1499 THB</div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">Shipping</div>
              <div className="Cart__text__Right__Content">99 THB</div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">Discount</div>
              <div className="Cart__text__Right__Content">400 THB</div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic__Total">Total</div>
              <div className="Cart__text__Right__Content__Total">1198 THB</div>
            </div>
            <div className="Cart__Right__Box">
              <div className="Cart__text__Right__Toppic">
                {currentAddress.name}
              </div>
              <div className="Cart__text__Right">
                <div className="Cart__text__Right__Content">
                  {currentAddress.Adr}
                  <br></br>
                  {currentAddress.District} {currentAddress.Province}
                  <br></br>
                  {currentAddress.Zip}
                  <br></br> Tel. {currentAddress.Tel}
                </div>
                <div className="Cart__Edit__Address__Container">
                  <button
                    className="Cart__Edit__Address"
                    onClick={handleChangeAddress}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
            <button className="Cart__payment__Button">Confirm Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};
