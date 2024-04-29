import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { spotify_storeCredentials } from "../hooks/useSpotify";
import playlist_urls from "../playlist_urls";
import "./css/crooked-frames.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Like_Icon from "./assets/icons/Like_Icon";
import View_Icon from "./assets/icons/View_Icon";
// import Date_Icon from "./assets/icons/Date_Icon";

import { gameModeContext } from "./GameModeContext";

function App() {
  const [selectedPlaylist, setPlaylist] = useState(playlist_urls.y_00s_metal);
  const { gameMode, setGameMode } = useContext(gameModeContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await spotify_storeCredentials();
    })();
  }, []);

  return (
    <div className="w-full min-h-svh max-h-svh max-w-full background-scroll-animation">
      <div className="shadow-wraper">
        <div className="container h-full foreground-pattern-scroll mx-auto bg-[#286D59] saturate-[0.75] min-h-svh sm:min-h-[91svh] flex flex-col gap-2 items-center pt-6 relative saw-tooth drop-shadow translate-y-[8px] sm:translate-y-0">
          {/* headline text */}
          <div className="text-center px-10 py-9 crooked-frame">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wider mb-4">
              Quizzfy
            </h1>
            <p className="text-base font-semibold md:text-lg lg:text-xl ">
              guess songs popularity
            </p>
          </div>

          {/* settings */}
          <div className="bg-[#b9d4cc] text-black flex flex-col py-4 px-6 gap-6 mt-6 rounded-lg text-center ">
            {/* platlist */}
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-lg ">Playlist Selection</h2>

              <Select
                value={playlist_urls.y_00s_metal}
                onValueChange={(value) => setPlaylist(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the Playlist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={playlist_urls.y_00s_metal}>
                      2000s Metal
                    </SelectItem>
                    <SelectItem value={playlist_urls.y_2024_metal}>
                      2024 Metal
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <hr className="border-black border-opacity-40" />

            {/* game mode */}
            <div className="">
              <h2 className="font-bold text-lg">Game Mode</h2>
              <div className="flex gap-2 mt-6 mb-4">
                {/* views option */}
                <div
                  className={`flex flex-col items-center justify-center w-[130px] aspect-square p-4 gap-4 cursor-pointer font-semibold transition-all duration-150 rounded-md bg-teal-600 saturate-[0.75] 
                  ${
                    gameMode === "views"
                      ? "bg-opacity-70 text-white drop-shadow-md shadow-md"
                      : "bg-opacity-0 outline-transparent text-gray-500"
                  }`}
                  onClick={() => setGameMode("views")}
                >
                  <View_Icon />
                  <span>Views</span>
                </div>

                {/* realese date option */}
                {/* <div
                  className={`flex flex-col items-center justify-center w-[130px] aspect-square p-4 gap-4 cursor-pointer font-semibold transition-all duration-150 rounded-md bg-teal-600 saturate-[0.75] 
                  ${
                    gameMode === "date"
                      ? "bg-opacity-70 text-white drop-shadow-md shadow-md"
                      : "bg-opacity-0 outline-transparent text-gray-500"
                  }`}
                  onClick={() => setGameMode("date")}
                >
                  <Date_Icon />
                  <span>Release Date</span>
                </div> */}

                {/* likes option */}
                <div
                  className={`flex flex-col items-center justify-center w-[130px] aspect-square p-4 gap-4 cursor-pointer font-semibold transition-all duration-150 rounded-md bg-teal-600 saturate-[0.75] 
                  ${
                    gameMode === "likes"
                      ? "bg-opacity-70 text-white drop-shadow-md shadow-md"
                      : "bg-opacity-0 outline-transparent text-gray-500"
                  }`}
                  onClick={() => setGameMode("likes")}
                >
                  <Like_Icon />
                  <span>Likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* start the game button  */}
          <button
            className="bg-cyan-600 rounded-md mt-8 md:mt-16 px-8 py-3 text-xl sm:text-2xl font-semibold transition-all duration-150 hover:bg-cyan-500 hover:scale-105 hover:drop-shadow-lg"
            onClick={() => {
              document.body.classList.add("closed");
              setTimeout(() => {
                navigate(`/game?playlist=${selectedPlaylist}`);
              }, 500);
            }}
          >
            Start
          </button>

          {/* tags */}
          <div className="mt-10 md:mt-auto sm:mb-4 w-full px-6 py-4 opacity-60 flex flex-col gap-2 font-semibold text-lg text-right">
            <span>Spotify-Logo</span>
            <span>Youtube-Logo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
