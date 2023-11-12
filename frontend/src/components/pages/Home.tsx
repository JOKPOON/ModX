import React from "react";
import "./Home.css";

export const Home = () => {
  return (
    <div>
      <div className="Home__Container">
        <div className="Home__Top"></div>
        <div className="Home__Middle">
          <div className="Home__Middle__Left"> 
          <div className="Home__headder">
            KMUTT ONLINE <br></br>
            BOOK STORE
            </div></div>
          <div className="Home__Middle__Right"> Mid R </div>
        </div>
        <div className="Home__Bottom">
          <div className="Home__Bottom__Left">Btm L</div>
          <div className="Home__Bottom__Right">Btm R</div>
        </div>
        <div className="Home__Footer"></div>
      </div>
    </div>
  );
};
