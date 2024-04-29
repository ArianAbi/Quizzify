import React, { Dispatch, createContext, useState } from "react";

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
  const [gameMode, setGameMode] = useState<"views" | "likes">("views");
  return (
    <gameModeContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </gameModeContext.Provider>
  );
}
