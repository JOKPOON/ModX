import "./Comment.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface items {
  name: string;
  price: number;
  picture?: string;
  orderID: number;
  quantity?: number;
}

const products: items[] = [
  {
    picture:
      "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
    name: "เข็มขัดผู้ชาย สำหรับนักศึกษาชาย",
    price: 999,
    orderID: 1,
    quantity: 1,
  },

  {
    picture:
      "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
    name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
    price: 960,
    orderID: 2,
    quantity: 4,
  },
  {
    picture:
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
    price: 99,
    orderID: 3,
    quantity: 1,
  },
];

export const Comment = () => {
  const navigate = useNavigate();
  const HandlegoBack = () => {
    navigate(-1);
  };

  const MockupOrderID = 515;

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleRatingClick = (rate: number) => {
    setSelectedRating(rate);
  };

  const RatingButton: React.FC<{ rate: number; onClick: () => void }> = ({
    rate,
    onClick,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const starColor =
      rate <= (isHovered ? selectedRating || 0 : selectedRating || 0)
        ? "#ff6e1f"
        : "#8F8F8F";

    return (
      <div className="Commet__Star">
        <i
          className="bx bxs-star icon AllProducts__Categories__Rating__Star"
          style={{ color: starColor }}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        ></i>
      </div>
    );
  };

  return (
    <div>
      <div className="Comment__Container">
        <div className="Comment__Back">
          <button onClick={HandlegoBack}>&lt;Back</button>
          <span style={{ color: "#fefefe" }}>orderID : {MockupOrderID}</span>
        </div>

        <div className="Comment__Topic">
          <div className="Comment__Topic__Text">
            <div className="Comment__Grid"></div>
            <div className="Comment__Grid">Product Name</div>
            <div className="Comment__Grid">Quantity</div>
            <div className="Comment__Grid">Price</div>
          </div>
        </div>
        <div className="Comment__Container__Content">
          <div className="Comment__Box">
            {products.map((product) => (
              <div className="Comment__Content">
                <div className="Comment__Top">
                  <div className="Commit__Picture__Container">
                    <div
                      className="Comment__Picture"
                      style={{ backgroundImage: `url(${product.picture})` }}
                    ></div>
                  </div>
                  <div className="Comment__Name">{product.name}</div>
                  <div className="Comment__Quantity">{product.quantity}</div>
                  <div className="Comment__Price">{product.price} THB</div>
                </div>
                <div className="Comment__Bottom">
                  <div className="Comment__Rate">
                    <RatingButton
                      rate={1}
                      onClick={() => handleRatingClick(1)}
                    />
                    <RatingButton
                      rate={2}
                      onClick={() => handleRatingClick(2)}
                    />
                    <RatingButton
                      rate={3}
                      onClick={() => handleRatingClick(3)}
                    />
                    <RatingButton
                      rate={4}
                      onClick={() => handleRatingClick(4)}
                    />
                    <RatingButton
                      rate={5}
                      onClick={() => handleRatingClick(5)}
                    />
                  </div>
                  <div className="Comment__input">
                    <input type="text" placeholder="Comment" />
                  </div>
                  <button className="Comment__Button">Review</button>
                </div>
              </div>
            ))}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
