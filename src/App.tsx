import { useState, useEffect } from "react";
import { getCredentials } from "./useSpotify";
import "./App.css";

function App() {
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
        <span>Hi , This is a Test</span>
        <span>{loading ? "loading..." : "All Set"}</span>
      </div>
    </>
  );
}

export default App;
