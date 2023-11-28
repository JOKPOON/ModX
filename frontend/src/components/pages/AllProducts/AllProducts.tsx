/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./AllProducts.css";
import Products from "./Products";
import { useNavigate, useLocation } from "react-router-dom";

interface CategoryButtonProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

interface items {
  id: number;
  picture?: string;
  title: string;
  sold: number;
  price: number;
  discount?: number;
}

const mockCategories = ["Education", "Clothes", "Electronics", "Accessories"];

//All Products Page Component
const CategoryButton: React.FC<CategoryButtonProps> = ({
  text,
  isSelected,
  onClick,
}) => {
  //Category Button
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

/*  All Products Page Component in this page we can filter the products by categories, price range and rating
    and sort the products by top sale, latest and rating 

    And we can also toggle the categories to show/hide the categories in different devices
  */
export const AllProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMinPrice = location.state?.minPrice || "";
  const initialMaxPrice = location.state?.maxPrice || "";
  const initialSelectedRating = location.state?.selectedRating || null;
  const initialSelectedCategories = location.state?.selectedCategories || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialSelectedCategories
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(
    initialSelectedRating
  );

  const [minPrice, setMinPrice] = useState<string>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice);
  const [showCategories, setShowCategories] = useState(true);
  const [sortType, setSortType] = useState("ASC");
  const [ProductsData, setProductsData] = useState<items[] | null>(null);
  const [ApplyButton, setApplyButton] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>("");

  const getProductsData = async () => {
    const response = await fetch(handleFetchString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status !== 200) {
      setProductsData(null);
    } else {
      setProductsData(data);
    }
  };

  useEffect(() => {
    getProductsData();
  }, [ApplyButton, sortType, selectedSort]);

  //Sort Button
  const handleSortToggle = () => {
    setSortType(sortType === "ASC" ? "DESC" : "ASC");
    console.log("Sort button clicked!\nSort type: ", sortType);
  };

  const handleFetchString = () => {
    const queryParams = [];

    if (selectedCategories.length > 0) {
      queryParams.push(`category=${selectedCategories.join(",")}`);
    }
    if (minPrice !== "") {
      queryParams.push(`min_price=${minPrice}`);
    }
    if (maxPrice !== "") {
      queryParams.push(`max_price=${maxPrice}`);
    }
    if (selectedRating !== null) {
      queryParams.push(`rating=${selectedRating}`);
    }
    if (sortType !== "ASC") {
      queryParams.push(`price_sort=${sortType}`);
    }
    if (selectedSort !== "") {
      queryParams.push(`sort=${selectedSort}`);
    }

    let fetchString = "http://localhost:8080/v1/product/all";
    if (queryParams.length > 0) {
      fetchString += "?" + queryParams.join("&");
    }
    return fetchString;
  };

  useEffect(() => {
    // for mobile devices
    const handleResize = () => {
      setShowCategories(window.innerWidth > 968); // if window width > 968, then show categories
    };

    handleResize();
    window.addEventListener("resize", handleResize); // add event listener to window

    return () => {
      window.removeEventListener("resize", handleResize); // remove event listener from window
    };
  }, []);

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleCategoryButtonClick = (text: string) => {
    setSelectedCategories((prevSelected) => {
      // if prevSelected is not an array, then set it to an empty array
      const categoriesArray = Array.isArray(prevSelected) ? prevSelected : [];

      // if categoriesArray already includes text, then remove it from the array
      const updatedCategories = categoriesArray.includes(text)
        ? categoriesArray.filter((category) => category !== text)
        : [...categoriesArray, text];

      return updatedCategories;
    });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(event.target.value);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating((prevRating) => (prevRating === rating ? null : rating));
    // if prevRating === rating, then set selectedRating to null, else set selectedRating to rating
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

  const generateCategoryButtons = () => {
    return mockCategories.map((category) => (
      <CategoryButton
        key={category}
        text={category}
        isSelected={selectedCategories.includes(category)}
        onClick={() => handleCategoryButtonClick(category)}
        /* if selectedCategories includes category, then isSelected is true, else isSelected is false 
        to show/hide the checkmark in different devices
        */
      />
    ));
  };

  const handleApplyButtonClick = () => {
    console.log("Apply button clicked!");
    console.log("Selected Categories: ", selectedCategories);
    console.log("Min Price: ", minPrice);
    console.log("Max Price: ", maxPrice);
    console.log("Selected Rating: ", selectedRating);
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      parseInt(minPrice) > parseInt(maxPrice)
    ) {
      alert(
        "You are stupid or what? Max price must be greater than min price!"
      );
      return;
    }
    navigate("/Allproducts", {
      state: {
        selectedCategories: selectedCategories,
        minPrice: minPrice,
        maxPrice: maxPrice,
        selectedRating: selectedRating,
      },
    });
    setApplyButton(!ApplyButton);
  };

  useEffect(() => {}, []);

  return (
    <div>
      <div className="AllProducts__Container">
        <div className="AllProducts__Sortby">
          <div className="AllProducts__Sortby__Text">
            <div className="AllProducts__Sortby__Text__Options">
              <div className="AllProducts__Sortby__Text__Title">Sort By</div>
              <button
                className={`AllProducts__Sortby__Text__Options__Button ${
                  selectedSort === "top_sale" ? "selected" : ""
                }`}
                onClick={() => setSelectedSort("top_sale")}
              >
                Top Sale
              </button>
              <button
                className={`AllProducts__Sortby__Text__Options__Button ${
                  selectedSort === "latest" ? "selected" : ""
                }`}
                onClick={() => setSelectedSort("latest")}
              >
                Latest
              </button>
              <button
                className={`AllProducts__Sortby__Text__Options__Button ${
                  selectedSort === "rating" ? "selected" : ""
                }`}
                onClick={() => setSelectedSort("rating")}
              >
                Rating
              </button>
            </div>
          </div>
          <div className="AllProducts__Sortby__Select">
            <button
              className="AllProducts__Sortby__Select__Button"
              onClick={handleSortToggle}
            >
              Price: {sortType === "ASC" ? "Low to High" : "High to Low"}
            </button>
          </div>
        </div>
        <div className="AllProducts__Section">
          {showCategories && (
            <div className="AllProducts__Categories">
              <div className="AllProducts__Categories__Text__Container">
                <div className="AllProducts__Categories__Text__Box">
                  <div className="AllProducts__Categories__Text">
                    Categories
                  </div>
                  {generateCategoryButtons()}
                  <div className="AllProducts__Categories__Text">
                    Price Range
                  </div>
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
          )}

          <div className="Toggle__Categories__Container">
            <button onClick={toggleCategories} className="Toggle__Categories">
              {showCategories ? (
                <i className="bx bx-chevron-left"></i>
              ) : (
                <i className="bx bx-sort"></i>
              )}
            </button>
          </div>
          <div className="AllProducts__Products">
            <Products product={ProductsData} />
          </div>
        </div>
      </div>
    </div>
  );
};
