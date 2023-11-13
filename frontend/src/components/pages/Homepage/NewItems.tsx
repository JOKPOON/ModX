import React, { useState, useEffect } from "react";
import "./Home.css";

interface Newitem {
  picture?: string;
  name: string;
  sold: number;
  price: number;
}

const newItemsData: Newitem[] = [
  {
    picture:
      "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
    name: "เข็มขัดผู้ชาย สำหรับนักศึกษาชายที่มีความต้องการที่จะสอบผ่านวิชา Engineering Economics",
    sold: 40000,
    price: 999,
  },
  {
    picture:
      "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
    name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
    sold: 20,
    price: 960,
  },
  {
    picture:
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
    sold: 10,
    price: 99,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/FACTFULNESS-%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%E0%B9%86-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99.png",
    name: "FACTFULNESS จริง ๆ แล้วโลกดีขึ้นทุกวัน",
    sold: 9,
    price: 800,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/21-%E0%B8%9A%E0%B8%97%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99.png",
    name: "21 บทเรียน สำหรับศตวรรษที่ 21 : 21 lessons for 21st century",
    sold: 20,
    price: 1590,
  },
];

const ITEMS_PER_PAGE = 2;

const NewItems = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrevClick = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - ITEMS_PER_PAGE, 0));
  };

  const handleNextClick = () => {
    setStartIndex((prevIndex) => prevIndex + ITEMS_PER_PAGE);
  };

  const visibleItems = newItemsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const isLastItemVisible = startIndex + ITEMS_PER_PAGE >= newItemsData.length;
  const showNextButton =
    newItemsData.length > ITEMS_PER_PAGE && !isLastItemVisible;

  const formatPrice = (price: number) => {
    const priceString = price.toString();
    const formatPriced = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formatPriced;
  };
  return (
    <div className="Home__New__Item__Container">
      <div className="NewItem__Button__Container__Left">
        {startIndex > 0 && (
          <button className="NewItem__Button__left" onClick={handlePrevClick}>
            <i className="bx bx-left-arrow-alt"></i>
          </button>
        )}
      </div>

      <div className="Home__New__Item__Box">
        {visibleItems.map((item) => (
          <div className="Home__New__Item" key={item.name}>
            <div
              className="Home__New__Item__Picture"
              style={{ backgroundImage: `url(${item.picture})` }}
            ></div>
            <div className="Home__New__Item__Container__Text">
              <div className="Home__New__Item__Name">{item.name}</div>
              <div className="Home__New__Item__btm__Container">
                <div className="Home__New__Item__Sold__Price__Container">
                  <div className="Home__New__Item__Sold">
                    {formatPrice(item.sold)} Sold
                  </div>
                  <div className="Home__New__Item__Price">
                    {formatPrice(item.price)} Baht
                  </div>
                </div>
                <div className="Home__NewItem__Arrow__Container">
                  <div className="Home__NewItem__Arrow__Box">
                    <div className="Home__NewItem__Arrow">
                      <i className="bx bx-right-arrow-alt"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNextButton && (
        <div className="NewItem__Button__Container__Right">
          <button className="NewItem__Button__right" onClick={handleNextClick}>
            <i className="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default NewItems;