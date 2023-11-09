import "./App.css";
import { Navbar } from "./components/Navbar";
import { Account, Cart , ContactUs, Home, Login, Notification, Register, Wishlist } from "./components/pages";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/Notification" element={<Notification />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Wishlist" element={<Wishlist />} />
        </Routes>
    </div>
  );
}
export default App;