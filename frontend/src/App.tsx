import "./App.css"; 
import { Navbar } from "./components/Navbar";
import { Home, Login, Register } from "./components/pages";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
    </div>
  );
}
export default App;