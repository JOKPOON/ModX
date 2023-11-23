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
} from "./components/pages";

function App() {
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
