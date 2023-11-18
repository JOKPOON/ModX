import "./App.css"; 
import { Navbar } from "./components/Navbar";
import { Login } from "./components/pages";
import {Home} from "./components/pages/Homepage/Home";

function App() {
  return (
    <div className="App">
      <Login/>
    </div>
  );
}
export default App;