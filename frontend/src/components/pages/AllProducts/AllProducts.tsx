import React from "react";
import "./AllProducts.css";

export const AllProducts = () => {
  return (
    <div>
      <div className="AllProducts__Container">
        <div className="AllProducts__Sortby">
          <div className="AllProducts__Sortby__Text">
            <div className="AllProducts__Sortby__Text__Options">
              {" "}
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
              <div className="AllProducts__Sortby__Text__Title">result : 78</div>
            </div>
          </div>
          <div className="AllProducts__Sortby__Select">
            <button className="AllProducts__Sortby__Select__Button">
              Price : Low to High
            </button>
          </div>
        </div>
        <div className="AllProducts__Categories"></div>
      </div>
    </div>
  );
};
