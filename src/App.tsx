import { useEffect } from "react";
import "./css/App.css";
import { Link } from "react-router-dom";
import { spotify_storeCredentials } from "../hooks/useSpotify";

function App() {
  useEffect(() => {
    (async () => {
      await spotify_storeCredentials();
    })();
  }, []);

  return (
    <>
      <div className="container">
        <Link to={"/game"}>Go To Game</Link>
      </div>
    </>
  );
}

export default App;
