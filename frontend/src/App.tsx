import "./App.css"; 
import { Navbar } from "./components/Navbar";
import { Home, AllProducts } from "./components/pages";

function App() {
  return (
    <div className="App">
      <Navbar />
      < AllProducts />
    </div>
  );
}
export default App;