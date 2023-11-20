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
}

interface Comment {
  name: string;
  comment: string;
  date?: string;
  index?: number;
  rating?: number;
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
    sold: 40,
    price: 999,
    discount: 10,
    rating: 4.5,
    itemAvailable: 10,
    description:
      "Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand",
  },
];

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

  const HandleToppic = () => {
    setCurrentPic((prevPic) =>
      prevPic > 0 ? prevPic - 1 : SingleItem[index]?.picture.length - 1
    );
  };

  const HandleBtmPic = () => {
    setCurrentPic((prevPic) =>
      prevPic < SingleItem[index]?.picture.length - 1 ? prevPic + 1 : 0
    );
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
                  1
                </button>
              </div>
              <div className="Single__Product__Left__Top__Picture">
                {SingleItem[index]?.picture
                  .slice(4)
                  .map((_imageUrl, imgIndex) => (
                    <div
                      className="Single__Product__Left__Container"
                      key={imgIndex}
                      style={{
                        backgroundImage: `url(${
                          SingleItem[index]?.picture?.[
                            (currentPic + imgIndex) %
                              SingleItem[index]?.picture.length
                          ]
                        })`,
                      }}
                    ></div>
                  ))}
              </div>
              <div className="Single__Button">
                <button className="Single__Button__Pic" onClick={HandleBtmPic}>
                  2
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
                  {Comment.length} Comments
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
                {SingleItem[index].sold}
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
                    {SingleItem[index].price -
                      (SingleItem[index].discount ?? 0)}
                  </span>
                )}
                <span style={{ color: "#222222", fontWeight: "500" }}>
                  &nbsp;{SingleItem[index].price}&nbsp;THB
                </span>
              </div>
              <div className="Single__Product__Sub">Sub</div>
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
