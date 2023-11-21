import "./SingleProduct.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface item {
  picture?: string[];
  name: string;
  sold: number;
  price: number;
  discount?: number;
  rating?: number;
  index?: number;
  itemAvailable?: number;
  description?: string;
  options?: {
    option_1?: {
      [size: string]: {
        option_2?: {
          [color: string]: {
            price: number;
            stock: number;
          };
        };
      };
    };
  };
}

const SingleItem: item[] = [
  {
    picture: [
      "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/FACTFULNESS-%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%E0%B9%86-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99.png",
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
      "https://www.kmutt.ac.th/wp-content/uploads/2020/08/HDR_0001-5-HDR-scaled.jpg",
      "https://steco.kmutt.ac.th/wp-content/uploads/2019/12/KMUTT-Landscape.jpg",
      "https://www.kmutt.ac.th/wp-content/uploads/2020/09/MG_0703-scaled.jpg",
      "https://www.kmutt.ac.th/wp-content/uploads/2020/08/%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%A1%E0%B8%94_%E0%B9%91%E0%B9%98%E0%B9%91%E0%B9%92%E0%B9%92%E0%B9%97_0091.jpg",
    ],
    name: "Female Uniform From KMUTT Fear of Natacha 2nd hand",
    sold: 4500,
    price: 9259,
    discount: 10,
    rating: 4.5,
    itemAvailable: 10,
    description:
      "Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand",
    options: {
      option_1: {
        S: {
          option_2: {
            Black: {
              price: 15,
              stock: 5,
            },
            White: {
              price: 17,
              stock: 10,
            },
            Red: {
              price: 19,
              stock: 8,
            },
            Blue: {
              price: 21,
              stock: 15,
            },
            Green: {
              price: 23,
              stock: 20,
            },
          },
        },
        M: {
          option_2: {
            Black: {
              price: 18,
              stock: 7,
            },
            White: {
              price: 20,
              stock: 12,
            },
            Red: {
              price: 22,
              stock: 10,
            },
            Blue: {
              price: 24,
              stock: 18,
            },
            Green: {
              price: 26,
              stock: 25,
            },
          },
        },
        L: {
          option_2: {
            Black: {
              price: 20,
              stock: 10,
            },
            White: {
              price: 22,
              stock: 15,
            },
            Red: {
              price: 24,
              stock: 12,
            },
            Blue: {
              price: 26,
              stock: 20,
            },
            Green: {
              price: 28,
              stock: 30,
            },
          },
        },
      },
    },
  },
];

interface Comment {
  name: string;
  comment: string;
  date?: string;
  index?: number;
  rating?: number;
}

const Comment: Comment[] = [
  {
    name: "Not Show",
    comment: "I like it",
    date: "2021-10-10",
    index: 1,
    rating: 4.5,
  },
  {
    name: "Peerapat",
    comment:
      "I hate it I hate it I hate it I hate it I hate it I hate it I hate it",
    date: "2021-10-10",
    index: 0,
    rating: 4.5,
  },
  {
    name: "Kanokpol",
    comment: "I like it",
    date: "2021-10-10",
    index: 0,
    rating: 4.5,
  },
  {
    name: "Jirapat",
    comment: "I like it",
    date: "2021-10-10",
    index: 0,
    rating: 4.5,
  },
  {
    name: "Jirapat",
    comment: "I like it",
    date: "2021-10-10",
    index: 0,
    rating: 4.5,
  },
  {
    name: "Jirapat",
    comment: "I like it",
    date: "2021-10-10",
    index: 0,
    rating: 4.5,
  },
  {
    name: "Jirapat",
    comment: "I like it",
    date: "2021-10-10",
    index: 0,
    rating: 4.5,
  },
];

export const SingleProduct = () => {
  const navigate = useNavigate();
  const HandlegoBack = () => {
    navigate(-1);
  };
  const [currentPic, setCurrentPic] = useState(0);
  const index = 0;
  const currentItem = SingleItem[index];

  const [visiblePics] = useState(3);

  const HandleToppic = () => {
    setCurrentPic((prevPic) =>
      prevPic > 0 ? prevPic - 1 : (currentItem?.picture?.length ?? 0) - 1
    );
  };

  const HandleBtmPic = () => {
    setCurrentPic((prevPic) =>
      prevPic < (currentItem?.picture?.length ?? 0) - 1 ? prevPic + 1 : 0
    );
  };

  const renderSelectOptions = () => {
    return Object.keys(currentItem)
      .filter(
        (key): key is keyof typeof currentItem =>
          key !== "picture" && Array.isArray(currentItem[key as keyof item])
      )
      .map((key) => (
        <div className={`Single__Product__Quantity`}>
          <span style={{ color: "#222222" }}>{key}&nbsp;&nbsp;</span>
          <span className="Single__Select">
            <select>
              {(currentItem[key] as string[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </span>
        </div>
      ));
  };

  const formatPrice = (price: number) => {
    const priceString = price.toString();
    const formatPriced = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formatPriced;
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
                {currentItem?.picture
                  ?.slice(0, visiblePics)
                  .map((_imageUrl, imgIndex) => (
                    <div
                      className="Single__Product__Left__Container"
                      key={imgIndex}
                      style={{
                        backgroundImage: `url(${
                          currentItem?.picture?.[
                            (currentPic + imgIndex) %
                              currentItem?.picture.length
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
                backgroundImage: `url(${SingleItem[index]?.picture?.[currentPic]})`,
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
                  {Comment.filter((item) => item.index === index).length}{" "}
                  Comments
                </div>
              </div>
              <div className="Single__Product__Review__Content">
                {Comment.map((item) =>
                  item.index === index ? (
                    <div
                      className="Single__Product__Review__Content__Container"
                      key={item.index}
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
              <div className="Single__Product__Name">{SingleItem[0].name}</div>
              <div className="Single__Product__RateNSold">
                <span style={{ color: "#222222" }}>Rating&nbsp;&nbsp;</span>
                {SingleItem[index].rating}
                &nbsp;&nbsp;&nbsp;
                <span style={{ color: "#222222" }}>Sold&nbsp;&nbsp;</span>
                {formatPrice(SingleItem[index].sold)}
              </div>
              <div className="Single__Product__Price">
                <span className="Single__Price" style={{ color: "#222222" }}>
                  Price&nbsp;&nbsp;
                </span>
                {(SingleItem[index].discount ?? 0) > 0 && (
                  <span
                    className="Single__Price"
                    style={{ textDecoration: "line-through", color: "#FF6E1F" }}
                  >
                    {formatPrice(
                      SingleItem[index].price -
                        (SingleItem[index].discount ?? 0)
                    )}
                  </span>
                )}
                <span style={{ color: "#222222", fontWeight: "500" }}>
                  &nbsp;{formatPrice(SingleItem[index].price)}&nbsp;THB
                </span>
              </div>
              <div className="Single__Product__Sub">
                {renderSelectOptions()}
              </div>
              <div className="Single__Product__Quantity">
                <span style={{ color: "#222222" }}>Quantity&nbsp;&nbsp;</span>
                <span className="Single__Select">
                  <select>
                    {Array.from(
                      { length: SingleItem[index].itemAvailable ?? 0 },
                      (_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      )
                    )}
                  </select>
                </span>
                <span style={{ color: "#656464" }}>
                  &nbsp;&nbsp;{SingleItem[index].itemAvailable} Pieces Available{" "}
                </span>
              </div>
              <div className="Single__Product__Description">
                <div style={{ color: "#222222" }}>Description&nbsp;&nbsp;</div>
                <div style={{ color: "#656464" }}>
                  {SingleItem[index].description}
                </div>
              </div>
            </div>
            <div className="Single__Product__Button">
              <button className="Single__Button__W">Add To Wishlist</button>
              <button className="Single__Button__W">Add to Cart</button>
              <button className="Single__Button__B">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
