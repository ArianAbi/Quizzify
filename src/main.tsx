import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./css/global.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Game from "./Game.tsx";
import GameModeProvider from "./GameModeContext.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import ErrorUI from "./components/ErrorUI.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary fallback={<ErrorUI />}>
        <App />
      </ErrorBoundary>
    ),
  },
  {
    path: "/game",
    element: (
      <ErrorBoundary fallback={<ErrorUI />}>
        <Game />
      </ErrorBoundary>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorUI />}>
      <GameModeProvider>
        <RouterProvider router={router} />
      </GameModeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
