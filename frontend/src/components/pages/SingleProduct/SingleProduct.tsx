import "./SingleProduct.css";
import { useNavigate } from "react-router-dom";

export const SingleProduct = () => {
  const navigate = useNavigate();
  const HandlegoBack = () => {
    navigate(-1);
  };

  return (
    <div className="Single__Product__Container">
      <div className="Single__Product__Header">
        <button onClick={HandlegoBack}>&lt;Back</button>
      </div>
      <div className="Single__Product__Content__Container">
        <div className="Single__Product__Top">
          <div className="Single__Product__Top__Left">Top Left</div>
          <div className="Single__Product__Top__Right">
            <div className="Single__Product__Top__Right__Container">
              <div className="Single__Product__Title">
                <div>Title</div>
                <div>Rating</div>
                <div>Sub</div>
                <div>Quantity</div>
              </div>
              <div className="Single__Product__button">
                <button className="Single__button">Buy Now</button>
                <button className="Single__button__Cart">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
        <div className="Single__Product__Bottom">
          <div className="Single__Product__Bottom__Left">Btm Left</div>
          <div className="Single__Product__Bottom__Right">
            <div className="Single__Product__Bottom__Right__Container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
