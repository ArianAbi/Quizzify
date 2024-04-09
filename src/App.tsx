import "./css/App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="container">
        <Link to={"/game"}>Go To Game</Link>
      </div>
    </>
  );
}

export default App;
