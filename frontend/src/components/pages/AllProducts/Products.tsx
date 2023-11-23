import { useEffect, useState } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Helper/Calculator";

// interface items {
//   picture?: string;
//   name: string;
//   sold: number;
//   price: number;
// }

interface items {
  title: string;
  price: number;
  discount?: number;
}

const ProductsData: items[] = [
  {
    picture:
      "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
    name: "เข็มขัดผู้ชาย สำหรับนักศึกษาชาย",
    sold: 40000,
    price: 999,
    discount: 400,
  },
  {
    picture:
      "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
    name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
    sold: 20,
    price: 960,
    discount: 445,
  },
  {
    picture:
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
    sold: 10,
    price: 99,
    discount: 20,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/FACTFULNESS-%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%E0%B9%86-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99.png",
    name: "FACTFULNESS จริง ๆ แล้วโลกดีขึ้นทุกวัน",
    sold: 9,
    price: 800,
    discount: 0,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/21-%E0%B8%9A%E0%B8%97%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99.png",
    name: "21 บทเรียน สำหรับศตวรรษที่ 21 : 21 lessons for 21st century",
    sold: 20,
    price: 1590,
    discount: 200,
  },
  {
    picture:
      "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
    name: "เข็มขัดผู้ชาย สำหรับนักศึกษาชาย",
    sold: 40000,
    price: 999,
    discount: 400,
  },
  {
    picture:
      "https://down-th.img.susercontent.com/file/91267398e5330558c9bda5cfab7b5fd4",
    name: "เครื่องคิดเลข CASIO รุ่น MX-120B",
    sold: 20,
    price: 960,
    discount: 445,
  },
  {
    picture:
      "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    name: "ปากกาเจลวันพีช One-piece Gel Pen M&G 0.5mm Blue ink ( 5 ด้าม/แพ็ค)",
    sold: 10,
    price: 99,
    discount: 20,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/FACTFULNESS-%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%E0%B9%86-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99.png",
    name: "FACTFULNESS จริง ๆ แล้วโลกดีขึ้นทุกวัน",
    sold: 9,
    price: 800,
    discount: 0,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/21-%E0%B8%9A%E0%B8%97%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99.png",
    name: "21 บทเรียน สำหรับศตวรรษที่ 21 : 21 lessons for 21st century",
    sold: 20,
    price: 1590,
    discount: 200,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/FACTFULNESS-%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%E0%B9%86-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99.png",
    name: "FACTFULNESS จริง ๆ แล้วโลกดีขึ้นทุกวัน",
    sold: 9,
    price: 800,
    discount: 0,
  },
  {
    picture:
      "https://shopee.co.th/blog/wp-content/uploads/2019/10/21-%E0%B8%9A%E0%B8%97%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99.png",
    name: "21 บทเรียน สำหรับศตวรรษที่ 21 : 21 lessons for 21st century",
    sold: 20,
    price: 1590,
    discount: 200,
  },
];

const Products = () => {
  const [ProductsData, setProducts] = useState<items[]>([]);
  const navigate = useNavigate();
  let itemsPerRow = 4;

  // To change number of items per row when screen size is smaller
  if (window.innerWidth <= 1200) {
    itemsPerRow = 3;
  }

  // To change number of items per row when screen size is smaller
  const rows = Array.from(
    { length: Math.ceil(ProductsData.length / itemsPerRow) },
    (_, rowIndex) =>
      ProductsData.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
  );


  // To handle when user click on add to cart button
  const handleAddToCartClick = (item: items, rowIndex: number, itemIndex: number) => {
    const overallIndex = rowIndex * itemsPerRow + itemIndex; // to get the index of the item in the overall array 
    console.log(`Selected item at index : ${overallIndex}:`, item);
    navigate("/SingleProduct", { state: { selectedItems: [item] } });
  };

  const handleAddToWishlist = (item: items, rowIndex: number, itemIndex: number) => {
    const overallIndex = rowIndex * itemsPerRow + itemIndex; // to get the index of the item in the overall array
    console.log(`Add item to wishlist at index : ${overallIndex}:`, item);
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8080/v1/product/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data[0].title);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="AllProducts__Products__Container">
      <div className="AllProducts__Products__Rows">
        {rows.map((row, rowIndex) => (
          <div className="AllProducts__Products__Items" key={rowIndex}>
            {row.map((item, itemIndex) => (
              <div className="AllProducts__Products__Item" key={itemIndex}>
                <button className="AllProducts__Products__Item__Wishlist"
                onClick={() => handleAddToWishlist(item, rowIndex, itemIndex)}
                >
                  <i className="bx bx-heart"></i>
                </button>
                <div
                  className="AllProducts__Products__Item__Picture"
                  style={{ backgroundImage: `url(${item.picture})` }}
                ></div>

                <div className="AllProducts__Products__Item__Text">
                  <div className="AllProducts__Products__Item__Name">
                    {item.name}
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
                            <span style={{  color: "#FF6E1F" ,textDecoration: "line-through", fontWeight: "400"}}>
                              {formatPrice(item.price)}
                            </span>
                          )}
                          {item.price - (item.discount || 0) > 0 && (
                            <span>
                              {" "}{formatPrice(item.price - (item.discount || 0))}{" "}
                              THB
                            </span>
                          )}
                        </div>
                      )}
                        </div>
                      </div>
                      <div>
                        <div className="AllProducts__Products__Item__Buttom">
                          <div className="AllProducts__Products__Item__Buttom__Text">
                            <div className="AllProducts__Products__Item__Sold">
                              Sold: {formatPrice(item.sold)}
                            </div>
                            <div className="AllProducts__Products__Item__Price">
                              Price: {formatPrice(item.price)} THB
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
      ) : (
        <>Loading</>
      )}
    </>
  );
};

export default Products;
