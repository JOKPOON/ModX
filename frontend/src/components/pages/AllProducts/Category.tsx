import React, { useState } from "react";
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

const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [selectedRating, setSelectedRating] = useState<number | null>(null);
const [minPrice, setMinPrice] = useState<string>("");
const [maxPrice, setMaxPrice] = useState<string>("");


const handleCategoryButtonClick = (text: string) => {
  setSelectedCategories((prevSelected) =>
    prevSelected.includes(text)
      ? prevSelected.filter((category) => category !== text)
      : [...prevSelected, text]
  );
};

const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setMinPrice(event.target.value);
};

const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setMaxPrice(event.target.value);
};

const handleRatingClick = (rating: number) => {
  setSelectedRating((prevRating) => (prevRating === rating ? null : rating));
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
    <div className="AllProducts__Categories__Rating__StarContainer">
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

  const handleApplyButtonClick = () => {
    console.log("Apply button clicked!");
    console.log("Selected Categories: ", selectedCategories);
    console.log("Min Price: ", minPrice);
    console.log("Max Price: ", maxPrice);
    console.log("Selected Rating: ", selectedRating);
  };

export const Category = () => {
  return (
    <div>
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
                value={minPrice}
                onChange={handleMinPriceChange}
              />
              <div className="AllProducts__Categories__Price__Range__line"></div>
              <input
                type="text"
                className="AllProducts__Categories__Price__Range__Input"
                placeholder="Max"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
            <div className="AllProducts__Categories__Text">Rating</div>
            <div className="AllProducts__Categories__Rating__Container">
              <RatingButton rate={1} onClick={() => handleRatingClick(1)} />
              <RatingButton rate={2} onClick={() => handleRatingClick(2)} />
              <RatingButton rate={3} onClick={() => handleRatingClick(3)} />
              <RatingButton rate={4} onClick={() => handleRatingClick(4)} />
              <RatingButton rate={5} onClick={() => handleRatingClick(5)} />
            </div>
            <div className="AllProducts__Categories__Apply">
              <button
                className="AllProducts__Categories__Apply__Button"
                onClick={handleApplyButtonClick}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
