/* eslint-disable react-hooks/exhaustive-deps */
import "./SingleProduct.css";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";
import { useEffect, useState } from "react";
import { singleProductItems } from "../../Interface/Interface";
import {
  HandleGetProduct,
  HandleAddToCart,
  HandleAddToWishlist,
  CheckToken,
} from "../../API/API";

export const SingleProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state.item;
  const [Product, setProduct] = useState<singleProductItems | null>(null);
  const [currentPic, setCurrentPic] = useState(0);
  const [visiblePics] = useState(3);
  const [selectedOptionKey1, setSelectedOptionKey1] = useState<string | null>(
    null
  );
  const [selectedOptionKey2, setSelectedOptionKey2] = useState<string | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const HandlegoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const initialData = () => {
    if (Product !== null) {
      setSelectedOptionKey1(
        Object.keys(Product?.options?.option_1 ?? {})[0] ?? null
      );
      setSelectedOptionKey2(
        Object.keys(
          Product?.options?.option_1?.[
            Object.keys(Product?.options?.option_1 ?? {})[0] ?? 0
          ]?.option_2 ?? {}
        )[0] ?? null
      );

      setSelectedPrice(Product.price ?? 0);
      setSelectedStock(Product.stock ?? 0);
    }
  };

  const handleSelectOption = () => {
    if (selectedOptionKey1 !== null && selectedOptionKey2 !== null) {
      setSelectedPrice(
        Product?.options?.option_1?.[selectedOptionKey1 ?? 0]?.option_2?.[
          selectedOptionKey2 ?? 0
        ]?.price ??
          Product?.price ??
          0
      );
      setSelectedStock(
        Product?.options?.option_1?.[selectedOptionKey1 ?? 0]?.option_2?.[
          selectedOptionKey2 ?? 0
        ]?.stock ??
          Product?.stock ??
          0
      );
    } else {
      setSelectedPrice(
        Product?.options?.option_1?.[selectedOptionKey1 ?? 0].price ??
          Product?.price ??
          0
      );
      setSelectedStock(
        Product?.options?.option_1?.[selectedOptionKey1 ?? 0].stock ??
          Product?.stock ??
          0
      );
    }
  };

  useEffect(() => {
    HandleGetProduct(item.id).then((data) => {
      setProduct(data);
    });
  }, []);

  useEffect(() => {
    initialData();
  }, [Product]);

  useEffect(() => {
    handleSelectOption();
  }, [selectedOptionKey1, selectedOptionKey2]);

  if (Product == null) {
    return <div className="Product__Not__Found">Product Not Found!</div>;
  }

  const HandleToppic = () => {
    setCurrentPic(
      (prevPic) =>
        prevPic > 0 ? prevPic - 1 : (Product?.picture?.length ?? 0) - 1
      //to change the number of picture
    );
  };

  const HandleBtmPic = () => {
    setCurrentPic(
      (prevPic) =>
        prevPic < (Product?.picture?.length ?? 0) - 1 ? prevPic + 1 : 0
      //to change the number of picture
    );
  };

  const renderSelectOptions = () => {
    return (
      <>
        {Product !== null && (
          <>
            <span style={{ color: "#222222" }}>
              {Product?.options?.option_name?.["option_1"]}
              &nbsp;&nbsp;
            </span>
            <span className="Single__Select">
              <select
                onChange={(e) => {
                  setSelectedOptionKey1(e.target.value);
                }}
              >
                {Object.keys(Product?.options?.option_1 ?? {}).map(
                  (optionKey, optionIndex) => (
                    <option key={optionIndex} value={optionKey}>
                      {optionKey}
                    </option>
                  )
                )}
              </select>
            </span>
            {selectedOptionKey2 !== null && (
              <>
                <span style={{ color: "#222222" }}>
                  {Product?.options?.option_name?.["option_2"]}
                  &nbsp;&nbsp;
                </span>
                <span className="Single__Select">
                  <select
                    onChange={(e) => {
                      setSelectedOptionKey2(e.target.value);
                    }}
                  >
                    {Object.keys(
                      Product?.options?.option_1?.[selectedOptionKey1 ?? 0]
                        ?.option_2 ?? {}
                    ).map((subOptionKey, subOptionIndex) => (
                      <option key={subOptionIndex} value={subOptionKey}>
                        {subOptionKey}
                      </option>
                    ))}
                  </select>
                </span>
              </>
            )}
          </>
        )}
      </>
    );
  };

  const HandleSingleItemToWishlist = () => {
    CheckToken()
      ? HandleAddToWishlist({
          id: 0,
          product_id: Product?.id ?? 0,
          quantity: selectedQuantity,
          options: {
            option_1: selectedOptionKey1 ?? "",
            option_2: selectedOptionKey2 ?? "",
          },
        })
      : navigate("/Login");
  };

  const HandleSingleItemToCart = () => {
    CheckToken()
      ? HandleAddToCart(Product?.id, selectedQuantity, {
          option_1: selectedOptionKey1 ?? "",
          option_2: selectedOptionKey2 ?? "",
        })
      : navigate("/Login");
  };

  const HandleSingleItemBuyNow = () => {
    HandleAddToCart(Product?.id, selectedQuantity, {
      option_1: selectedOptionKey1 ?? "",
      option_2: selectedOptionKey2 ?? "",
    });
    navigate("/Cart");
  };

  return (
    <div className="Single__Product__Container">
      <div className="Single__Product__Header">
        <button onClick={HandlegoBack}>&lt;Back</button>
      </div>
      <div className="Single__Product__Content__Container">
        <div className="Single__Product__Left">
          <div className="Single__Product__Left__Top">
            <div className="Single__Product__Pic__Left">
              <div className="Single__Button">
                <button className="Single__Button__Pic" onClick={HandleToppic}>
                  <i className="bx bx-chevron-up"></i>
                </button>
              </div>
              <div className="Single__Product__Left__Top__Picture">
                {Product?.picture
                  ?.slice(0, visiblePics)
                  .map((_imageUrl, imgIndex) => (
                    <div
                      className="Single__Product__Left__Container"
                      key={imgIndex}
                      style={{
                        backgroundImage: `url(${
                          Product?.picture?.[
                            (currentPic + imgIndex) % Product?.picture.length
                          ]
                        })`,
                      }}
                    ></div>
                  ))}
              </div>

              <div className="Single__Button">
                <button className="Single__Button__Pic" onClick={HandleBtmPic}>
                  <i className="bx bx-chevron-down"></i>
                </button>
              </div>
            </div>
            <div
              className="Single__Product__Pic__Right"
              style={{
                backgroundImage: `url(${Product?.picture?.[currentPic]})`,
              }}
            ></div>
          </div>
          <div className="Single__Product__Left__Bottom">
            <div className="Single__Product__Review">
              <div className="Single__Product__Review__Header">
                <div className="Single__Product__Review__Header__Title">
                  Reviews
                </div>
                <div
                  className="Single__Product__Review__length"
                  style={{ color: "#656464" }}
                >
                  {Product.review?.length + " "}
                  Comments
                </div>
              </div>
              <div className="Single__Product__Review__Content">
                {Product.review?.map((item, index) => (
                  <div
                    className="Single__Product__Review__Content__Container"
                    key={index}
                  >
                    <div className="Single__Product__Review__Content__Left">
                      <div className="Single__Product__Review__Content__Name">
                        {item.name}
                      </div>
                      <div className="Single__Product__Review__Content__Comment">
                        {item.comment}
                      </div>
                    </div>
                    <div className="Single__Product__Review__Content__Right">
                      <div className="Single__Product__Review__Content__Date">
                        <div style={{ color: "#656464", fontWeight: "400" }}>
                          Rating : {item.rating ? item.rating / 10 : 0}
                        </div>
                        {item.created_at}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="Single__Product__Right">
          <div className="Single__Product__Right__Container">
            <div className="Single__Product__Datails">
              <div className="Single__Product__Name">{Product.title}</div>
              <div className="Single__Product__RateNSold">
                <span style={{ color: "#222222" }}>Rating&nbsp;&nbsp;</span>
                {(Product.rating ?? 0) / 10}
                &nbsp;&nbsp;&nbsp;
                <span style={{ color: "#222222" }}>Sold&nbsp;&nbsp;</span>
                {formatPrice(Product.sold)}
              </div>
              <div className="Single__Product__Price">
                <span className="Single__Price" style={{ color: "#222222" }}>
                  Price&nbsp;&nbsp;
                </span>
                {(Product.discount ?? 0) > 0 && (
                  <span
                    className="Single__Price"
                    style={{ textDecoration: "line-through", color: "#FF6E1F" }}
                  >
                    {formatPrice(selectedPrice ?? 0)}
                  </span>
                )}
                <span style={{ color: "#222222", fontWeight: "500" }}>
                  &nbsp;
                  {formatPrice(
                    (selectedPrice ?? 0) - (Product.discount ?? 0) ?? 0
                  )}
                  &nbsp;THB
                </span>
              </div>
              <div className="Single__Product__Sub">
                {renderSelectOptions()}
              </div>
              <div className="Single__Product__Quantity">
                <span style={{ color: "#222222" }}>Quantity&nbsp;&nbsp;</span>
                <span className="Single__Quantity">
                  <button
                    className="Single__Quantity__Button"
                    onClick={() => {
                      if (selectedQuantity > 1) {
                        setSelectedQuantity(selectedQuantity - 1);
                      }
                    }}
                  >
                    -
                  </button>
                  <span className="Single__Quantity__Value">
                    {selectedQuantity}
                  </span>
                  <button
                    className="Single__Quantity__Button"
                    onClick={() => {
                      if (
                        selectedStock !== null &&
                        selectedQuantity < selectedStock
                      ) {
                        setSelectedQuantity(selectedQuantity + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </span>
                <span style={{ color: "#656464" }}>
                  &nbsp;&nbsp;{selectedStock} Pieces Available{" "}
                </span>
              </div>
              <div className="Single__Product__Description">
                <div style={{ color: "#222222" }}>Description&nbsp;&nbsp;</div>
                <div style={{ color: "#656464" }}>{Product.desc}</div>
              </div>
            </div>
            <div className="Single__Product__Button">
              <button
                className="Single__Button__W"
                onClick={HandleSingleItemToWishlist}
              >
                Add To Wishlist
              </button>
              <button
                className="Single__Button__W"
                onClick={HandleSingleItemToCart}
              >
                Add to Cart
              </button>
              <button
                className="Single__Button__B"
                onClick={HandleSingleItemBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
