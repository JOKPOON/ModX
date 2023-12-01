import "./App.css";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  Home,
  AllProducts,
  SingleProduct,
  Cart,
  Login,
  Comment,
  Account,
  Notification,
  Wishlist,
} from "./components/pages";
import { useScript } from "@uidotdev/usehooks";

function App() {
  const status = useScript(`https://cdn.omise.co/omise.js`, {
    removeOnUnmount: false,
  });

  if (status === "error") {
    return <div>Failed to load Omise.js</div>;
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AllProducts" element={<AllProducts />} />
          <Route path="/SingleProduct" element={<SingleProduct />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Comment" element={<Comment />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Wishlist" element={<Wishlist />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
