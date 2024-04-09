import { useState } from "react";
import { getVideoByTerm } from "../hooks/useYoutube";
import "./css/App.css";
import { Link } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState("");

  return (
    <>
      <div className="container">
        <span>{loading ? "loading..." : "All Set"}</span>

        <Link to={"/game"}>Go To Game</Link>

        <div>
          <div className="flex flex-col gap-4">
            <input
              className="text-black px-2"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Term..."
            />

            <button
              onClick={async () => {
                const data = await getVideoByTerm(term);
                console.log(data && data.items);
              }}
            >
              Get Videos
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
