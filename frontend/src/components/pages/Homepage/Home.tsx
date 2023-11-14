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
    "https://www.kmutt.ac.th/wp-content/uploads/2020/08/HDR_0001-5-HDR-scaled.jpg",
    "https://steco.kmutt.ac.th/wp-content/uploads/2019/12/KMUTT-Landscape.jpg",
    "https://www.kmutt.ac.th/wp-content/uploads/2020/09/MG_0703-scaled.jpg",
    "https://www.kmutt.ac.th/wp-content/uploads/2020/08/%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%A1%E0%B8%94_%E0%B9%91%E0%B9%98%E0%B9%91%E0%B9%92%E0%B9%92%E0%B9%97_0091.jpg",
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
                  <div className="Home__Categories__Header">EDUCATION</div>
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
