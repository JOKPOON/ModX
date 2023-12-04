import "./Products.css";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";

interface items {
  id: number;
  picture?: string;
  title: string;
  sold: number;
  price: number;
  discount?: number;
}

function Products({ product }: { product: items[] | null }) {
  const ProductsData = product;
  const navigate = useNavigate();

  let itemsPerRow = 4;

  // To change number of items per row when screen size is smaller
  if (window.innerWidth <= 1200) {
    itemsPerRow = 3;
  }

  console.log("ProductsData", ProductsData);
  // To change number of items per row when screen size is smaller
  if (ProductsData == null || ProductsData.length == 0) {
    return <div className="Product__Not__Found">Product Not Found!</div>;
  }
  const rows = Array.from(
    { length: Math.ceil(ProductsData.length / itemsPerRow) },
    (_, rowIndex) =>
      ProductsData.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
  );

  // To handle when user click on add to cart button
  const handleAddToCartClick = (
    item: items,
    rowIndex: number,
    itemIndex: number
  ) => {
    const overallIndex = rowIndex * itemsPerRow + itemIndex; // to get the index of the item in the overall array
    console.log(`Selected item at index : ${overallIndex}:`, item);
    navigate("/SingleProduct", { state: { item: item } });
  };

  return (
    <>
      <div className="AllProducts__Products__Container">
        <div className="AllProducts__Products__Rows">
          {rows.map((row, rowIndex) => (
            <div className="AllProducts__Products__Items" key={rowIndex}>
              {row.map((item, itemIndex) => (
                <div className="AllProducts__Products__Item" key={itemIndex}>
                  <div
                    className="AllProducts__Products__Item__Picture"
                    style={{ backgroundImage: `url(${item.picture})` }}
                  ></div>

                  <div className="AllProducts__Products__Item__Text">
                    <div className="AllProducts__Products__Item__Name">
                      {item.title}
                    </div>
                    <div>
                      <div className="AllProducts__Products__Item__Buttom">
                        <div className="AllProducts__Products__Item__Buttom__Text">
                          <div className="AllProducts__Products__Item__Sold">
                            Sold: {formatPrice(item.sold)}
                          </div>
                          <div className="AllProducts__Products__Item__Price">
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
                        <div className="AllProducts__Products__Item__Button">
                          <button
                            className="AllProducts__Products__Item__Button__Add"
                            onClick={() =>
                              handleAddToCartClick(item, rowIndex, itemIndex)
                            }
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
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
