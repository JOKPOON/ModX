import React, { useState, useEffect } from "react";
import "./Home.css";
import NewItems from "./NewItems";
import Educations from "../assets/Educations.svg";
import Clothes from "../assets/Clothes.svg";
import Electronics from "../assets/Electronics.svg";
import Accessories from "../assets/Accessories.svg";

export const Home = () => {
  const [currentBackground, setCurrentBackground] = useState(0);

  const backgrounds = [
    "https://i.kym-cdn.com/photos/images/original/002/491/279/26f.gif",
    "https://media4.giphy.com/media/xUNd9CxrgrFmvp27du/giphy.gif",
    "https://avatars.githubusercontent.com/u/111488842?v=4",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground(
        (prevBackground) => (prevBackground + 1) % backgrounds.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentBackground, backgrounds.length]);

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
          <div className="Home__Middle__Right">
            <button
              className="Home__Advertisement"
              style={{
                backgroundImage: `url(${backgrounds[currentBackground]})`,
              }}
            ></button>
          </div>
        </div>
        <div className="Home__Bottom">
          <div className="Home__Bottom__Left">
            <div className="Home__header__btm">NEW ITEMS</div>
            <NewItems />
          </div>
          <div className="Home__Bottom__Right">
            <div className="Home__header__btm">CATEGORIES</div>
            <div className="Home__Categories__Container">
              <div className="Home__Categories__Top">
                <button
                  className="Home__Categories__Top__Left"
                  style={{ backgroundImage: `url(${Educations})` }}
                >
                  <div className="Home__Education__Arrow">
                    <div className="Home__Education__Arrow__Container">
                      <i className="bx bx-right-arrow-alt"></i>
                    </div>
                  </div>
                  <div className="Home__Categories__Header">EDUCATIONS</div>
                </button>

                <button
                  className="Home__Categories__Top__Right"
                  style={{ backgroundImage: `url(${Clothes})` }}
                >
                  <div className="Home__Education__Arrow">
                    <div className="Home__Education__Arrow__Container">
                      <i className="bx bx-right-arrow-alt"></i>
                    </div>
                  </div>
                  <div className="Home__Categories__Header">CLOTHES</div>
                </button>
              </div>
              <div className="Home__Categories__Bottom">
                <button
                  className="Home__Categories__Bottom__Left"
                  style={{ backgroundImage: `url(${Electronics})` }}
                >
                  <div className="Home__Education__Arrow">
                    <div className="Home__Education__Arrow__Container">
                      <i className="bx bx-right-arrow-alt"></i>
                    </div>
                  </div>
                  <div className="Home__Categories__Header">ELECTRONICS</div>
                </button>
                <button
                  className="Home__Categories__Bottom__Right"
                  style={{ backgroundImage: `url(${Accessories})` }}
                >
                  <div className="Home__Education__Arrow">
                    <div className="Home__Education__Arrow__Container">
                      <i className="bx bx-right-arrow-alt"></i>
                    </div>
                  </div>
                  <div className="Home__Categories__Header">ACCESSORIES</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
