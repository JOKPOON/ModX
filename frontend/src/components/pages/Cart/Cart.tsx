/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "./Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";

interface items {
  product_image?: string;
  product_title: string;
  price: number;
  discount?: number;
  options?: {
    option_1?: string;
    option_2?: string;
  };
  quantity: number;
}

interface ShippingDetails {
  name?: string;
  tel?: string;
  addr?: string;
  province?: string;
  district?: string;
  sub_dist?: string;
  zip?: number;
}

export const Cart = () => {
  const navigate = useNavigate();
  const [selectedItemIndices, setSelectedItemIndices] = useState<number[]>([]);
  const [CartProducts, setCartProducts] = useState<items[] | null>(null);
  const [shippingData, setShippingData] = useState<ShippingDetails>();

  const handleGetShippingAddress = async () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/Login");
    }

    await fetch("http://localhost:8080/v1/users/shipping", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((data) => {
          console.log(data);
          setShippingData(data);
        });
      }
    });
  };

  const handleGetCartProducts = async () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/Login");
    }

    await fetch("http://localhost:8080/v1/cart/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 403) {
          navigate("/Login");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setCartProducts(data.products);
      })
      .catch((err) => {
        console.log(err);
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

  useEffect(() => {
    handleGetCartProducts();
    handleGetShippingAddress();
  }, []);

  return (
    <div className="Cart__Container">
      <div className="Cart__Header">
        <div className="Cart__Header__Left"></div>
        <div className="Cart__Header__Right">
          <button
            className="Cart__Edit__Address"
            onClick={() => {
              const allItemIndices = CartProducts?.map((_, index) => index);
              setSelectedItemIndices(allItemIndices ?? []);
            }}
          >
            Select All
          </button>

          <div className="Cart__Gap"></div>
          <button className="Cart__Delete__Button">Delete</button>
        </div>
      </div>
      <div className="Cart__Body">
        <div className="Cart__Left">
          {CartProducts?.map((product, index) => (
            <div key={index}>
              <div className="Cart__Left__Container">
                <div className="Cart__Left__Grid1">
                  <button
                    onClick={() => handleToggleCart(index)}
                    className={`Cart__select__Togggle${
                      selectedItemIndices.includes(index) ? " clicked" : ""
                    }`}
                  >
                    <i className="bx bx-check icon"></i>
                  </button>
                </div>
                <React.Fragment key={index}>
                  <div
                    className="Cart__Left__Grid2"
                    style={{ backgroundImage: `url(${product.product_image})` }}
                  ></div>
                  <div className="Cart__Left__Grid3">
                    <div>{product.product_title}</div>
                    <div className="Cart__Sub">
                      <div>{product.options?.option_1}</div>
                      <div>{product.options?.option_2}</div>
                    </div>
                  </div>
                  <div className="Cart__Left__Grid4">
                    <label htmlFor={`quantity-${index}`}></label>
                    <select
                      id={`quantity-${index}`}
                      value={product.quantity}
                      onChange={(e) => {
                        const newQuantity = e.target.value;
                        const newCartProducts = CartProducts?.map((p, i) => {
                          if (i === index) {
                            return {
                              ...p,
                              quantity: Number(newQuantity),
                            };
                          } else {
                            return p;
                          }
                        });
                        setCartProducts(newCartProducts);
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="Cart__Left__Grid5">
                    <div className="Cart__Left__Grid5__Container">
                      <div>{formatPrice(product.price)}</div>
                      THB
                    </div>
                  </div>
                </React.Fragment>
              </div>
            </div>
          ))}
          <button className="Cart__Left__Button"> Shop More Item</button>
        </div>
        <div className="Cart__Right">
          <div className="Cart__Right__Container">
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">
                items (
                {selectedItemIndices.reduce(
                  (total, index) => total + CartProducts![index].quantity,
                  0
                )}
                )
              </div>
              <div className="Cart__text__Right__Content">
                {formatPrice(
                  selectedItemIndices.reduce(
                    (total, index) =>
                      total +
                      CartProducts![index].quantity *
                        CartProducts![index].price,
                    0
                  )
                )}
                THB
              </div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">Shipping</div>
              <div className="Cart__text__Right__Content">
                {formatPrice(
                  selectedItemIndices.reduce(
                    (total, index) =>
                      total + CartProducts![index].quantity * 30,
                    0
                  )
                )}
                THB
              </div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic">Discount</div>
              <div className="Cart__text__Right__Content">
                {formatPrice(
                  selectedItemIndices.reduce(
                    (total, index) =>
                      total +
                      CartProducts![index].quantity *
                        CartProducts![index].discount!,
                    0
                  )
                )}
                THB
              </div>
            </div>
            <div className="Cart__text__Right">
              <div className="Cart__text__Right__Toppic__Total">Total</div>
              <div className="Cart__text__Right__Content__Total">
                {formatPrice(
                  selectedItemIndices.reduce(
                    (total, index) =>
                      total +
                      CartProducts![index].quantity *
                        CartProducts![index].price,
                    0
                  ) +
                    selectedItemIndices.reduce(
                      (total, index) => total + CartProducts![index].quantity,
                      0
                    ) *
                      30
                )}
                THB
              </div>
            </div>
            <div className="Cart__Right__Box">
              <div className="Cart__text__Right__Toppic">
                {shippingData?.name ? shippingData?.name : "Name"}
              </div>
              <div className="Cart__text__Right">
                <div className="Cart__text__Right__Content">
                  {shippingData?.addr ? shippingData?.addr : "Address"}
                  <br></br>
                  {shippingData?.sub_dist
                    ? shippingData?.sub_dist
                    : "Subdistrict"}{" "}
                  {shippingData?.district ? shippingData?.district : "District"}{" "}
                  {shippingData?.province ? shippingData?.province : "Provice"}
                  <br></br>
                  {shippingData?.zip ? shippingData?.zip : "Zipcode"}
                  <br></br> Tel. {shippingData?.tel ? shippingData?.tel : "Tel"}
                </div>
                <div className="Cart__Edit__Address__Container">
                  <button
                    className="Cart__Edit__Address"
                    onClick={() => {
                      navigate("/Account");
                    }}
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
