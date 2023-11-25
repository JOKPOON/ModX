import "./SingleProduct.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatPrice } from "../Helper/Calculator";
import { Product } from "../Helper/product";
import { comments } from "../Helper/Comment";

export const SingleProduct = () => {
  const navigate = useNavigate();
  const HandlegoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const [currentPic, setCurrentPic] = useState(0);
  const index = 0;

  const [visiblePics] = useState(3);

  const firstOptionKey = Object.keys(Product.options ?? {})[0];
  const firstSubOptionKey = Object.keys(
    Product.options?.[firstOptionKey] ?? {}
  )[0];

  const [selectedOption, setSelectedOption] = useState({
    price:
    Product.options?.[firstOptionKey]?.[firstSubOptionKey]?.price ?? 0,
    stock:
    Product.options?.[firstOptionKey]?.[firstSubOptionKey]?.stock ?? 0,
  });

  const selectedPrice = selectedOption?.price ?? 0;
  const selectedStock = selectedOption?.stock ?? 0;

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

  const [selectedOptionKey1, setSelectedOptionKey1] = useState<string | null>(null);
  const [selectedSubOption1, setSelectedSubOption1] = useState<string | null>(null);
  const [selectedOptionKey2, setSelectedOptionKey2] = useState<string | null>(null);
  const [selectedSubOption2, setSelectedSubOption2] = useState<string | null>(null);

  const renderSelectOptions = () => {
    // To render the select options
    return Object.keys(Product.options ?? {}).map((optionKey) => (
      <div className={`Single__Product__Quantity`} key={optionKey}>
        <span style={{ color: "#222222" }}>
          {Product.option_name?.[optionKey]}&nbsp;&nbsp;
        </span>
        <span className="Single__Select">
          <select
            onChange={(e) => handleOptionChange(optionKey, e.target.value)}
          >
            {Object.keys(Product.options?.[optionKey] ?? {}).map(
              (subOptionKey) => (
                <option key={subOptionKey} value={subOptionKey}>
                  {subOptionKey}
                </option>
              )
            )}
          </select>
        </span>
      </div>
    ));
  };

  const handleOptionChange = (optionKey: string, selectedSubOption: string) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      price: Product.options?.[optionKey]?.[selectedSubOption]?.price ?? 0,
      stock: Product.options?.[optionKey]?.[selectedSubOption]?.stock ?? 0,
    }));

    if (selectedOptionKey1 === null) {
      setSelectedOptionKey1(optionKey);
      setSelectedSubOption1(selectedSubOption);
    } else {
      setSelectedOptionKey2(optionKey);
      setSelectedSubOption2(selectedSubOption);
    }
  };

  const defaultOption1 = Object.keys(Product.options ?? {})[0];
  const defaultSubOption1 = Object.keys(
    Product.options?.[defaultOption1] ?? {}
  )[0];
  const defaultOption2 = Object.keys(Product.options ?? {})[1];
  const defaultSubOption2 = Object.keys(
    Product.options?.[defaultOption2] ?? {}
  )[0];
  useEffect(() => {
    setSelectedOptionKey1(defaultOption1);
    setSelectedSubOption1(defaultSubOption1);
    setSelectedOptionKey2(defaultOption2);
    setSelectedSubOption2(defaultSubOption2);
  }, []);

  const HandleSingleItemToWishlist = () => {
    console.log("Add to Wishlist Add by index of Item");
  };

  const HandleSingleItemToCart = () => {
    if (
      selectedOptionKey1 &&
      selectedSubOption1 &&
      selectedOptionKey2 &&
      selectedSubOption2
    ) {
      const stateOptions = {
        option1: Product.option_name?.[selectedOptionKey1] ?? selectedOptionKey1,
        subOption1: selectedSubOption1,
        option2: Product.option_name?.[selectedOptionKey2] ?? selectedOptionKey2,
        subOption2: selectedSubOption2,
        name: Product.name,
        price: selectedPrice,
        stock: selectedStock,
        picture: Product?.picture?.[0],
      };
  
      {
        console.log(stateOptions);
      };
    } else {
      console.log("Options are not selected properly");
    }
  };

  const HandleSingleItemBuyNow = () => {
    if (
      selectedOptionKey1 &&
      selectedSubOption1 &&
      selectedOptionKey2 &&
      selectedSubOption2
    ) {
      const stateOptions = {
        option1: Product.option_name?.[selectedOptionKey1] ?? selectedOptionKey1,
        subOption1: selectedSubOption1,
        option2: Product.option_name?.[selectedOptionKey2] ?? selectedOptionKey2,
        subOption2: selectedSubOption2,
        name: Product.name,
        price: selectedPrice,
        stock: selectedStock,
        picture: Product?.picture?.[0],
      };
  
      {
        console.log(stateOptions);
        navigate("/Cart");
      };
    } else {
      console.log("Options are not selected properly");
    }
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
                  {comments.filter((item) => item.index === index).length}{" "}
                  Comments
                </div>
              </div>
              <div className="Single__Product__Review__Content">
                {comments.map((item) =>
                  item.index === index ? (
                    <div
                      className="Single__Product__Review__Content__Container"
                      key={`${item.index}-${item.name}`}
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
                            Rating : {item.rating}
                          </div>
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="Single__Product__Right">
          <div className="Single__Product__Right__Container">
            <div className="Single__Product__Datails">
              <div className="Single__Product__Name">{Product.name}</div>
              <div className="Single__Product__RateNSold">
                <span style={{ color: "#222222" }}>Rating&nbsp;&nbsp;</span>
                {Product.rating}
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
                    {formatPrice(selectedPrice)}
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
                <span className="Single__Select">
                  <select>
                    {Array.from({ length: selectedStock ?? 0 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </span>
                <span style={{ color: "#656464" }}>
                  &nbsp;&nbsp;{selectedStock} Pieces Available{" "}
                </span>
              </div>
              <div className="Single__Product__Description">
                <div style={{ color: "#222222" }}>Description&nbsp;&nbsp;</div>
                <div style={{ color: "#656464" }}>{Product.description}</div>
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
