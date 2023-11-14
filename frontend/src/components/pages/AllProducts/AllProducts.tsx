import React, { useState, useEffect } from "react";
import "./AllProducts.css";

interface CategoryButtonProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  text,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`AllProducts__Categories__Text__Option ${
        isSelected ? "clicked" : ""
      }`}
      onClick={onClick}
    >
      <div className={`Category__button ${isSelected ? "clicked" : ""}`}>
        <i className="bx bx-check icon"></i>
      </div>
      <div className="AllProducts__Categories__Option__Button__Text">
        {text}
      </div>
    </button>
  );
};

export const AllProducts = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    console.log("Selected Categories: ", selectedCategories);
  }, [selectedCategories]);

  const handleCategoryButtonClick = (text: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(text)
        ? prevSelected.filter((category) => category !== text)
        : [...prevSelected, text]
    );
  };

  const mockCategories = ["Education", "Clothes", "Electronics", "Accessories"];

  const generateCategoryButtons = () => {
    return mockCategories.map((category) => (
      <CategoryButton
        key={category}
        text={category}
        isSelected={selectedCategories.includes(category)}
        onClick={() => handleCategoryButtonClick(category)}
      />
    ));
  };

  return (
    <div>
      <div className="AllProducts__Container">
        <div className="AllProducts__Sortby">
          <div className="AllProducts__Sortby__Text">
            <div className="AllProducts__Sortby__Text__Options">
              <div className="AllProducts__Sortby__Text__Title">Sort By</div>
              <button className="AllProducts__Sortby__Text__Options__Button">
                Top Sale
              </button>
              <button className="AllProducts__Sortby__Text__Options__Button">
                Latest
              </button>
              <button className="AllProducts__Sortby__Text__Options__Button">
                Promotion
              </button>
              <div className="AllProducts__Sortby__Text__Title">
                result : 78
              </div>
            </div>
          </div>
          <div className="AllProducts__Sortby__Select">
            <button className="AllProducts__Sortby__Select__Button">
              Price : Low to High
            </button>
          </div>
        </div>
        <div className="AllProducts__Section">
          <div className="AllProducts__Categories">
            <div className="AllProducts__Categories__Text__Container">
              <div className="AllProducts__Categories__Text__Box">
                <div className="AllProducts__Categories__Text">Categories</div>
                {generateCategoryButtons()}
                <div className="AllProducts__Categories__Text">Price Range</div>
                <div className="AllProducts__Categories__Price__Range">
                  <input
                    type="text"
                    className="AllProducts__Categories__Price__Range__Input"
                    placeholder="Min"
                  />
                  <div className="AllProducts__Categories__Price__Range__line"></div>
                  <input
                    type="text"
                    className="AllProducts__Categories__Price__Range__Input"
                    placeholder="Max"
                  />
                </div>
                <div className="AllProducts__Categories__Text">Rating</div>
                <div className="AllProducts__Categories__Rating">
                  this is options section
                </div>
                <div className="AllProducts__Categories__Apply">
                  <button className="AllProducts__Categories__Apply__Button">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="AllProducts__Products">
            <div className="AllProducts__Products__Container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
