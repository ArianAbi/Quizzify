import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./css/global.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Game from "./Game.tsx";
import GameModeProvider from "./GameModeContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameModeProvider>
      <RouterProvider router={router} />
    </GameModeProvider>
  </React.StrictMode>
);
