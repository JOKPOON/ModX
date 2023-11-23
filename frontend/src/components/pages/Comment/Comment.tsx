import "./Comment.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "../Helper/Calculator";

interface items {
  name: string;
  price: number;
  picture?: string;
  itemID: number;
  quantity?: number;
  rating: number | null;
}

export const Comment = () => {
  const navigate = useNavigate();
  const HandlegoBack = () => {
    navigate(-1);
  };

  const MockupOrderID = 515;

  const [products, setProducts] = useState<items[]>([
    {
      picture:
        "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
      name: "เข็มขัดผู้ชาย สำหรับนักศึกษาชาย",
      price: 999,
      itemID: 1,
      quantity: 1,
      rating: null,
    },
    {
      picture:
        "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
      name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
      price: 960,
      itemID: 2,
      quantity: 4,
      rating: null,
    },
    {
      picture:
        "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
      name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
      price: 99,
      itemID: 3,
      quantity: 1,
      rating: null,
    }, 
  ]);

  const [, setSelectedRating] = useState<number | null>(null); 
  const [commentData, setCommentData] = useState<{ [itemID: number]: { rating: number | null; comment: string } }>({});
  const handleRatingClick = (rate: number, itemID: number) => {
    const updatedProducts = products.map((product) => 
      product.itemID === itemID ? { ...product, rating: rate } : product 
      // if itemID === itemID then rating = rate else rating = product.rating
    );
    setProducts(updatedProducts);
    setSelectedRating(rate);

    const ratedItem = updatedProducts.find(
      (product) => product.itemID=== itemID
    );
    if (ratedItem) {
      setCommentData((prevData) => ({
        ...prevData,
        [itemID]: { ...prevData[itemID], rating: ratedItem.rating },
        // if itemID === itemID then rating = ratedItem.rating else rating = prevData[itemID].rating
      }));
    }
  };

  const RatingButton: React.FC<{
    rate: number;
    onClick: () => void;
    selectedRating: number | null;
  }> = ({ rate, onClick, selectedRating }) => {
    return (
      <div className="Commet__Star">
        <i
          className="bx bxs-star icon AllProducts__Categories__Rating__Star"
          style={{
            color: rate <= (selectedRating ?? 0) ? "#ff6e1f" : "#8F8F8F",
            cursor: "pointer",
          }}
          onClick={onClick}
        ></i>
      </div>
    );
  };

  const handleCommentChange = (comment: string, orderID: number) => {
    setCommentData((prevData) => ({
      ...prevData,
      [orderID]: { ...prevData[orderID], comment },
      // if orderID === orderID then comment = comment else comment = prevData[orderID].comment
    }));
  };

  const HandleReviewClick = () => {
    const reviewData = products.map((product) => {
      const { itemID, rating } = product;
      const comment = commentData[itemID]?.comment || '';
      return {
        orderID: MockupOrderID,
        itemID,
        rate: rating,
        review: comment,
      };
    });
  
    console.log('Review Data:', reviewData);
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
              <div className="Comment__Content" key={product.itemID}>
                <div className="Comment__Top">
                  <div className="Commit__Picture__Container">
                    <div
                      className="Comment__Picture"
                      style={{ backgroundImage: `url(${product.picture})` }}
                    ></div>
                  </div>
                  <div className="Comment__Name">{product.name}</div>
                  <div className="Comment__Quantity">{product.quantity}</div>
                  <div className="Comment__Price">{formatPrice(product.price)} THB</div>
                </div>
                <div className="Comment__Bottom">
                  <div className="Comment__Rate">
                    <RatingButton
                      rate={1}
                      onClick={() => handleRatingClick(1, product.itemID)}
                      selectedRating={product.rating}
                    />
                    <RatingButton
                      rate={2}
                      onClick={() => handleRatingClick(2, product.itemID)}
                      selectedRating={product.rating}
                    />
                    <RatingButton
                      rate={3}
                      onClick={() => handleRatingClick(3,  product.itemID)}
                      selectedRating={product.rating}
                    />
                    <RatingButton
                      rate={4}
                      onClick={() => handleRatingClick(4, product.itemID)}
                      selectedRating={product.rating}
                    />
                    <RatingButton
                      rate={5}
                      onClick={() => handleRatingClick(5,  product.itemID)}
                      selectedRating={product.rating}
                    />
                  </div>
                  <div className="Comment__input">
                    <input
                      type="text"
                      placeholder="Comment"
                      value={commentData[product.itemID]?.comment || ""}
                      onChange={(e) =>
                        handleCommentChange(e.target.value, product.itemID)
                      }
                    />
                  </div>
                  <button
                    className="Comment__Button"
                    onClick={HandleReviewClick}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ); 
};