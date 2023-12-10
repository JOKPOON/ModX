/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "./Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";
import {
  cartItems,
  orderProducts,
  shippingDetails,
} from "../../Interface/Interface";
import {
  HandleCheckout,
  HandleDeleteCart,
  HandleGetCartProducts,
  HandleGetShippingAddress,
} from "../../API/API";

export const Cart = () => {
  const navigate = useNavigate();
  const [selectedItemIndices, setSelectedItemIndices] = useState<number[]>([]);
  const [CartProducts, setCartProducts] = useState<cartItems[] | null>(null);
  const [shippingData, setShippingData] = useState<shippingDetails>();
  const [orderProducts, setOrderProducts] = useState<orderProducts[]>();
  let Total = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OmiseCard = (window as any).OmiseCard;

  const handleToggleCart = (id: number) => {
    setSelectedItemIndices((prevSelectedIndices) => {
      const isSelected = prevSelectedIndices.includes(id);
      if (isSelected) {
        return prevSelectedIndices.filter((i) => i !== id);
      } else {
        return [...prevSelectedIndices, id];
      }
    });
  };

  const handleCreateOrder = async () => {
    setOrderProducts([]);
    selectedItemIndices.map((id) => {
      const product = CartProducts?.find((p) => p.id === id);
      const orderProduct = {
        product_id: product?.product_id ?? 0,
        quantity: product?.quantity ?? 0,
        options: product?.options,
      };
      setOrderProducts((prevOrderProducts) => [
        ...(prevOrderProducts ?? []),
        orderProduct,
      ]);
    });
  };

  useEffect(() => {
    HandleGetCartProducts().then((res) => {
      setCartProducts(res);
    });

    HandleGetShippingAddress().then((res) => {
      setShippingData(res);
    });
  }, []);

  useEffect(() => {
    console.log("Selected items: ", selectedItemIndices);
    handleCreateOrder();
  }, [selectedItemIndices, CartProducts]);

  return (
    <>
      <div className="Cart__Container">
        <div className="Cart__Header">
          <div className="Cart__Header__Left"></div>
          <div className="Cart__Header__Right">
            <button
              className="Cart__Edit__Address"
              onClick={() => {
                const allItemIndices = CartProducts?.map(
                  (product) => product.id
                );
                setSelectedItemIndices(allItemIndices ?? []);
              }}
            >
              Select All
            </button>

            <div className="Cart__Gap"></div>
            <button
              className="Cart__Delete__Button"
              onClick={async () => {
                const res = await HandleDeleteCart(
                  CartProducts ?? [],
                  selectedItemIndices
                );
                if (res === "can't find token") {
                  navigate("/Login");
                } else {
                  setCartProducts(res);
                }
                setSelectedItemIndices([]);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="Cart__Body">
          <div className="Cart__Left">
            {CartProducts?.map((product) => (
              <div key={product.id}>
                <div className="Cart__Left__Container">
                  <div className="Cart__Left__Grid1">
                    <button
                      onClick={() => handleToggleCart(product.id)}
                      className={`Cart__select__Togggle${
                        selectedItemIndices.includes(product.id)
                          ? " clicked"
                          : ""
                      }`}
                    >
                      <i className="bx bx-check icon"></i>
                    </button>
                  </div>
                  <React.Fragment key={product.id}>
                    <div
                      className="Cart__Left__Grid2"
                      style={{
                        backgroundImage: `url(${product.product_image})`,
                      }}
                    ></div>
                    <div className="Cart__Left__Grid3">
                      <div>{product.product_title}</div>
                      <div className="Cart__Sub">
                        <div>{product.options?.option_1}</div>
                        <div>{product.options?.option_2}</div>
                      </div>
                    </div>
                    <div className="Cart__Left__Grid4">
                      <label htmlFor={`quantity-${product.id}`}></label>
                      <select
                        className="Cart__Left__Grid4__Select"
                        id={`quantity-${product.id}`}
                        defaultValue={product.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          const newCartProducts = CartProducts?.map((p) =>
                            p.id === product.id
                              ? { ...p, quantity: newQuantity }
                              : p
                          );
                          setCartProducts(newCartProducts ?? []);
                        }}
                      >
                        {[...Array(10)].map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
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
                  Subtotal ({selectedItemIndices.length} items)
                </div>
                <div className="Cart__text__Right__Content">
                  {CartProducts?.reduce(
                    (total, product) =>
                      total +
                      (selectedItemIndices.includes(product.id)
                        ? product.price * product.quantity
                        : 0),
                    0
                  ) + " "}
                  THB
                </div>
              </div>
              <div className="Cart__text__Right">
                <div className="Cart__text__Right__Toppic">Shipping</div>
                <div className="Cart__text__Right__Content">
                  {CartProducts?.reduce(
                    (total, product) =>
                      total +
                      (selectedItemIndices.includes(product.id)
                        ? 10 * product.quantity
                        : 0),
                    0
                  ) + " "}
                  THB
                </div>
              </div>
              <div className="Cart__text__Right">
                <div className="Cart__text__Right__Toppic">Discount</div>
                <div className="Cart__text__Right__Content">
                  {CartProducts?.reduce(
                    (total, product) =>
                      total +
                      (selectedItemIndices.includes(product.id)
                        ? product.discount ?? 0
                        : 0),
                    0
                  ) + " "}
                  THB
                </div>
              </div>
              <div className="Cart__text__Right">
                <div className="Cart__text__Right__Toppic__Total">Total</div>
                <div className="Cart__text__Right__Content__Total">
                  {CartProducts?.reduce(
                    (total, product) =>
                      (Total =
                        total +
                        (selectedItemIndices.includes(product.id)
                          ? product.price * product.quantity -
                            (product.discount ?? 0) +
                            10 * product.quantity
                          : 0)),
                    0
                  ) + " "}{" "}
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
                    {shippingData?.district
                      ? shippingData?.district
                      : "District"}{" "}
                    {shippingData?.province
                      ? shippingData?.province
                      : "Provice"}
                    <br></br>
                    {shippingData?.zip ? shippingData?.zip : "Zipcode"}
                    <br></br> Tel.{" "}
                    {shippingData?.tel ? shippingData?.tel : "Tel"}
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
              <button
                className={`Cart__payment__Button${
                  selectedItemIndices.length === 0 ? "__Disabled" : ""
                }  `}
                onClick={() => {
                  HandleCheckout(orderProducts ?? [], Total, OmiseCard);
                }}
                disabled={selectedItemIndices.length === 0}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
