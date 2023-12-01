/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "./Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";

interface items {
  id: number;
  product_id: number;
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
  id?: number;
  name?: string;
  tel?: string;
  addr?: string;
  province?: string;
  district?: string;
  sub_dist?: string;
  zip?: number;
}

interface OrderProducts {
  product_id: number;
  quantity: number;
  options?: {
    option_1?: string;
    option_2?: string;
  };
}

export const Cart = () => {
  const navigate = useNavigate();
  const [selectedItemIndices, setSelectedItemIndices] = useState<number[]>([]);
  const [CartProducts, setCartProducts] = useState<items[] | null>(null);
  const [shippingData, setShippingData] = useState<ShippingDetails>();
  const [orderProducts, setOrderProducts] = useState<OrderProducts[]>();
  let Total = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OmiseCard = (window as any).OmiseCard;

  function omiseHandler(order_id: number) {
    console.log("order_id", order_id);
    OmiseCard.configure({
      publicKey: "pkey_test_5xh7smyrjtw4ythtq7n",
      currency: "thb",
      frameLabel: "ModX",
      submitLabel: "PAY NOW",
      buttonLabel: "Pay with Omise",

      defaultPaymentMethod: "credit_card",
      otherPaymentMethods: [],
    });

    OmiseCard.open({
      amount: Total * 100,
      submitFormTarget: "#checkout-form",
      onCreateTokenSuccess: async (nonce: string) => {
        await fetch("http://localhost:8080/v1/payment/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: nonce,
            order_id: order_id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              alert("Payment Success");
              navigate("/Notification");
            }
            console.log(data);
          });
      },
      onFormClosed: () => {},
    });
  }

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

  const handleDeleteCart = async () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/Login");
    }

    const newCartProducts = CartProducts?.filter(
      (_, index) => !selectedItemIndices.includes(index)
    );
    setCartProducts(newCartProducts ?? []);

    await fetch("http://localhost:8080/v1/cart/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_id: selectedItemIndices,
      }),
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
      })
      .catch((err) => {
        console.log(err);
      });

    setSelectedItemIndices([]);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/Login");
    }

    const res = await fetch("http://localhost:8080/v1/order/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_products: orderProducts,
      }),
    }).then(async (res) => {
      console.log(res);
      if (res.status === 403) {
        navigate("/Login");
      }
      return await res.json();
    });

    console.log("res", res);
    omiseHandler(res.order_id);
  };

  useEffect(() => {
    console.log("Selected items: ", selectedItemIndices);
    handleCreateOrder();
  }, [selectedItemIndices]);

  useEffect(() => {
    console.log("orderProducts: ", orderProducts);
  }, [orderProducts]);

  useEffect(() => {
    handleGetCartProducts();
    handleGetShippingAddress();
  }, []);

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
            <button className="Cart__Delete__Button" onClick={handleDeleteCart}>
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
                onClick={handleCheckout}
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
