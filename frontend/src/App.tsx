import "./App.css";
import { Navbar } from "./components/Navbar";
import { Home, AllProducts } from "./components/pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AllProducts" element={<AllProducts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;