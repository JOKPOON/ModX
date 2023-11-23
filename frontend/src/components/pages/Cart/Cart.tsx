import React, { useEffect } from "react";
import "./Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";

interface items {
  picture?: string;
  name: string;
  price: number;
  discount?: number;
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
    price: 999,
    discount: 0,
  },
  {
    picture:
      "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
    name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
    price: 960,
    discount: 400,
  },
  {
    picture:
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
    price: 99,
    discount: 40,
  },
];

export const Cart = () => {
  const navigate = useNavigate();
  const [currentAddress] = useState(AddressData[0]);
  const [selectedItemIndices, setSelectedItemIndices] = useState<number[]>([]);

  const handleDeleteItemsFromcart = () => {
    // Delete items from cart
    setSelectedItemIndices((prevSelectedIndices) =>
      prevSelectedIndices.filter(
        (index) => !selectedItemIndices.includes(index)
      )
    );
    console.log("Delete items: ", selectedItemIndices);
  };

  const handleChangeAddress = () => {
    navigate("/Account");
  };

  const [itemQuantities, setItemQuantities] = useState<number[]>(
    CartProducts.map(() => 1) // Initialize all quantities to 1
  );

  const handleQuantityChange = (index: number, quantity: number) => {
    setItemQuantities((prevQuantities) => {
      // Make a copy of the previous quantities array
      const newQuantities = [...prevQuantities];
      newQuantities[index] = quantity;
      return newQuantities;
    });
  };

  const handleToggleCart = (index: number) => {
    setSelectedItemIndices((prevSelectedIndices) => {
      // Check if the item is already selected
      const isSelected = prevSelectedIndices.includes(index);

      if (isSelected) {
        // Remove the item from the list
        return prevSelectedIndices.filter((i) => i !== index);
      } else {
        // Add the item to the list
        return [...prevSelectedIndices, index];
      }
    });
  };

  useEffect(() => {
    console.log("Selected items: ", selectedItemIndices);
  }, [selectedItemIndices]);

  const calculateOverallPrice = (): number => {
    // Calculate the total price of all selected items
    return selectedItemIndices.reduce(
      (total, index) =>
        total + CartProducts[index].price * itemQuantities[index],
      0
    );
  };

  const calculateOverallDiscount = (): number => {
    // Calculate the total discount of all selected items
    return selectedItemIndices.reduce(
      (total, index) =>
        total + (CartProducts[index].discount || 0) * itemQuantities[index],
      0
    );
  };

  const calculateShippingPrice = (): number => {
    // Calculate the shipping price of all selected items
    const shippingCostPerItem = 15;
    const totalQuantity = selectedItemIndices.reduce(
      (total, index) => total + itemQuantities[index],
      0
    );
    return totalQuantity * shippingCostPerItem;
  };

  const calculateTotal = (): number => {
    // Calculate the total price of all selected items
    const overallPrice = calculateOverallPrice();
    const overallDiscount = calculateOverallDiscount();
    const ShippingPrice = calculateShippingPrice();
    return overallPrice - overallDiscount + ShippingPrice;
  };

  const HandleShopMoreItem = () => {
    navigate("/AllProducts");
  };

  const totalPrice = calculateTotal();

  const HandleConfirmPayment = () => {
    console.log("User Name:", currentAddress.name);
    console.log("Total Price:", totalPrice);
  };

  return (
    <div className="Cart__Container">
      <div className="Cart__Header">
        <div className="Cart__Header__Left"></div>
        <div className="Cart__Header__Right">
          <button
            className="Cart__Edit__Address"
            onClick={() => {
              const allItemIndices = CartProducts.map((_, index) => index);
              setSelectedItemIndices(allItemIndices);
            }}
          >
            Select All
          </button>

          <div className="Cart__Gap"></div>
          <button
            className="Cart__Delete__Button"
            onClick={handleDeleteItemsFromcart}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="Cart__Body">
        <div className="Cart__Left">
          {CartProducts.map((product, index) => (
            <div className="Cart__Left__Container">
              <div className="Cart__Left__Grid1">
                <button
                  className={`Cart__select__Togggle${
                    selectedItemIndices.includes(index) ? " clicked" : ""
                  }`}
                  onClick={() => handleToggleCart(index)}
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
                <div className="Cart__Left__Grid4">
                  <label htmlFor={`quantity-${index}`}></label>
                  <select
                    id={`quantity-${index}`}
                    value={itemQuantities[index]}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Cart__Left__Grid5">
                  <div style={{ color: "#222222" }}>
                    {(CartProducts[index].discount ?? 0) > 0 && (
                      <div>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#FF6E1F",
                          }}
                        >
                          {formatPrice(
                            CartProducts[index].price * itemQuantities[index]
                          )}{" "}
                        </span>
                        <br />
                        {formatPrice(
                          (CartProducts[index].price -
                            (CartProducts[index].discount ?? 0)) *
                            itemQuantities[index]
                        )}{" "}
                      </div>
                    )}
                    {CartProducts[index].discount === 0 && (
                      <div>
                        {formatPrice(
                          CartProducts[index].price * itemQuantities[index]
                        )}
                      </div>
                    )}{" "}
                    THB
                  </div>
                </div>
              </React.Fragment>
            </div>
          ))}
          <button
            className="Cart__Left__Button"
            onClick={() => HandleShopMoreItem()}
          >
            {" "}
            Shop More Item
          </button>
        </div>
        <div className="Cart__Right">
          <div className="Cart__Right__Container">
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">
                items (
                {selectedItemIndices.reduce(
                  (total, index) => total + itemQuantities[index],
                  0
                )}
                )
              </div>
              <div className="Cart__text__Right__Content">
                {formatPrice(calculateOverallPrice())}THB
              </div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">Shipping</div>
              <div className="Cart__text__Right__Content">
                {formatPrice(calculateShippingPrice())} THB
              </div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">Discount</div>
              <div className="Cart__text__Right__Content">
                - {formatPrice(calculateOverallDiscount())} THB
              </div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic__Total">Total</div>
              <div className="Cart__text__Right__Content__Total">
                {formatPrice(totalPrice)} THB
              </div>
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
            <button
              className="Cart__payment__Button"
              onClick={() => HandleConfirmPayment()}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
