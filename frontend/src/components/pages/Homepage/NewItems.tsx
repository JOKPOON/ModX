import { useEffect, useState } from "react";
import { formatPrice } from "../Helper/Calculator";
import { useNavigate } from "react-router-dom";
import { productItems } from "../../Interface/Interface";
import { GetProductsData } from "../../API/API";

const ITEMS_PER_PAGE = 2;

const NewItems = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const [newItemsData, setNewItemsData] = useState<productItems[]>([]);

  const handlePrevClick = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - ITEMS_PER_PAGE, 0));
  };

  const handleNextClick = () => {
    setStartIndex((prevIndex) => prevIndex + ITEMS_PER_PAGE);
  };

  // To set the number of items per page
  const visibleItems =
    newItemsData.length > 0
      ? newItemsData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
      : [];

  // To check if the last item is visible
  const isLastItemVisible = startIndex + ITEMS_PER_PAGE >= newItemsData.length;
  const showNextButton =
    newItemsData.length > ITEMS_PER_PAGE && !isLastItemVisible;

  const handleSelectItemFromNewItem = () => {
    navigate("/AllProducts");
  };

  useEffect(() => {
    GetProductsData([], "", "", null, "", "", " ", "5").then((res) => {
      setNewItemsData(res);
    });
  }, []);

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
          <div className="Home__New__Item" key={item.id}>
            <div
              className="Home__New__Item__Picture"
              style={{ backgroundImage: `url(${item.picture})` }}
            ></div>
            <div className="Home__New__Item__Container__Text">
              <div className="Home__New__Item__Name">{item.title}</div>
              <div className="Home__New__Item__btm__Container">
                <div className="Home__New__Item__Sold__Price__Container">
                  <div className="Home__New__Item__Sold">
                    {formatPrice(item.sold)} Sold
                  </div>
                  <div className="Home__New__Item__Price">
                    {(item.discount || item.discount === 0) &&
                      item.price - (item.discount || 0) > 0 && (
                        <div style={{ color: "#222222" }}>
                          {item.discount > 0 && (
                            <span
                              style={{
                                color: "#FF6E1F",
                                textDecoration: "line-through",
                                fontWeight: "400",
                              }}
                            >
                              {formatPrice(item.price)}
                            </span>
                          )}
                          {item.price - (item.discount || 0) > 0 && (
                            <span>
                              {" "}
                              {formatPrice(
                                item.price - (item.discount || 0)
                              )}{" "}
                              THB
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
                <div className="Home__NewItem__Arrow__Container">
                  <div className="Home__NewItem__Arrow__Box">
                    <button
                      className="Home__NewItem__Arrow"
                      onClick={() => handleSelectItemFromNewItem()}
                    >
                      <i className="bx bx-right-arrow-alt"></i>
                    </button>
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
