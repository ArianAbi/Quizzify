import { useEffect, useState } from "react";
import "./css/Game.css";
import { getCredentials } from "../hooks/useSpotify";

export default function Game() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function storeCredentials() {
      try {
        const credentials = await getCredentials();
        localStorage.setItem("access-token", JSON.stringify(credentials));

        setLoading(false);
      } catch (err) {
        console.error("SOME ERROR OCCURRED : " + err);
      }
    }

    storeCredentials();
  }, []);

  return (
    <>
      <div className="container">
        <span>{loading ? "loading..." : "All Set"}</span>

        <button>Start</button>
      </div>
    </>
  );
}
