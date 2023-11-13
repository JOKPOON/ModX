import React from "react";
import "./Home.css";
import NewItems from "./NewItems";

export const Home = () => {
  return (
    <div>
      <div className="Home__Container">
        <div className="Home__Top"></div>
        <div className="Home__Middle">
          <div className="Home__Middle__Left">
            <div className="Home__headder__Container">
              <div className="Home__header">
                KMUTT ONLINE <br></br>
                BOOK STORE
              </div>
              <div className="Home__subheader">
                Elevating the KMUTT experience with our exclusive store.
                <br></br>
                Discover, Unwind, and Celebrate Your University Spirit!
              </div>
              <div className="Home__button__Container">
                <button className="Home__button">Visti Store</button>
              </div>
            </div>
          </div>
          <div className="Home__Middle__Right"></div>
        </div>
        <div className="Home__Bottom">
          <div className="Home__Bottom__Left">
            <div className="Home__header__btm">NEW ITEMS</div>

              <NewItems />
          </div>
          <div className="Home__Bottom__Right">
            <div className="Home__header__btm">CATEGORIES</div>
            <div className="Home__Catagories__Container">
              <div className="Home__Catagories__Top">
              </div>
              <div className="Home__Catagories__Bottom">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
