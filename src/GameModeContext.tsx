import React, { Dispatch, createContext, useState, useEffect } from "react";

interface gameModeContextType {
  gameMode: "views" | "likes";
  setGameMode: Dispatch<React.SetStateAction<"views" | "likes">>;
}

export const gameModeContext = createContext<gameModeContextType>({
  gameMode: "views",
  setGameMode: () => {
    throw new Error("setGameMode Not Implemented");
  },
});

export default function GameModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefGameMode = localStorage.getItem("gameMode");

  const [gameMode, setGameMode] = useState<"views" | "likes">(
    prefGameMode ? JSON.parse(prefGameMode).gameMode : "views"
  );

  //store the game mode
  useEffect(() => {
    const pref = JSON.stringify({ gameMode: gameMode });
    localStorage.setItem("gameMode", pref);
  }, [gameMode]);

  return (
    <gameModeContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </gameModeContext.Provider>
  );
}
