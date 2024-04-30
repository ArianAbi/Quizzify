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
    <div className="w-full h-full background-scroll-animation">
      <div className="shadow-wraper h-full w-full">
        <section className="container max-h-full sm:max-h-[756px] foreground-pattern-scroll saw-tooth mx-auto h-full bg-[#286D59] saturate-[0.75] flex flex-col gap-6 items-center justify-center sm:justify-start py-6 translate-y-[8px] sm:translate-y-0">
          <div className="flex flex-col gap-6 items-center">
            {/* github link */}
            <a
              target="_blank"
              className="absolute right-4 top-4 w-10 sm:w-12 shadow-lg drop-shadow-sm bg-black p-2 rounded-full transition-all duration-150 hover:scale-110 hover:shadow-xl hover:drop-shadow-lg"
              href="https://github.com/ArianAbi/Quizzify"
            >
              <img className="invert" src="/github.svg" alt="github-link" />
            </a>

            {/* headline text */}
            <div className="text-center w-max p-5 md:p-10 crooked-frame">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wider mb-0 sm:mb-2 md:mb-4">
                Quizzfy
              </h1>
              <p className="text-sm sm:text-base font-semibold md:text-lg lg:text-xl ">
                guess songs popularity
              </p>
            </div>

            {/* settings */}
            <div className="bg-[#b9d4cc] text-black flex flex-col py-4 px-6 gap-6 rounded-lg text-center ">
              {/* platlist */}
              <div className="flex flex-col gap-3 sm:gap-6">
                <h2 className="font-bold text-base sm:text-lg ">
                  Playlist Selection
                </h2>

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
                <h2 className="font-bold mb-4 text-base sm:text-lg">
                  Game Mode
                </h2>
                <div className="flex gap-4">
                  {/* views option */}
                  <div
                    className={`flex flex-col items-center justify-center w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] p-4 gap-4 cursor-pointer font-semibold transition-all duration-150 rounded-md bg-teal-600 saturate-[0.75] 
                  ${
                    gameMode === "views"
                      ? "bg-opacity-70 text-white drop-shadow-md shadow-md"
                      : "bg-opacity-0 outline-transparent text-gray-500"
                  }`}
                    onClick={() => setGameMode("views")}
                  >
                    <View_Icon />
                    <span className="text-sm sm:text-base md:text-lg">
                      Views
                    </span>
                  </div>

                  {/* likes option */}
                  <div
                    className={`flex flex-col items-center justify-center  w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] p-4 gap-4 cursor-pointer font-semibold transition-all duration-150 rounded-md bg-teal-600 saturate-[0.75] 
                  ${
                    gameMode === "likes"
                      ? "bg-opacity-70 text-white drop-shadow-md shadow-md"
                      : "bg-opacity-0 outline-transparent text-gray-500"
                  }`}
                    onClick={() => setGameMode("likes")}
                  >
                    <Like_Icon />
                    <span className="text-sm sm:text-base md:text-lg">
                      Likes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* start the game button  */}
          <button
            className="bg-cyan-600 rounded-md px-8 py-3 text-xl sm:text-2xl font-semibold transition-all duration-150 hover:bg-cyan-500 hover:scale-105 hover:drop-shadow-lg"
            onClick={() => {
              document.body.classList.add("closed");
              setTimeout(() => {
                navigate(`/game?playlist=${selectedPlaylist}`);
                document.body.classList.remove("closed");
              }, 500);
            }}
          >
            Start
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
