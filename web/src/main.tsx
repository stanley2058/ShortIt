import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./components/Home";
import Manage from "./components/Manage";
import "./index.css";
import Header from "./components/Header";

const router = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/manage",
    element: <Manage />,
  },
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <Header>
          <Routes>
            {router.map((r) => (
              <Route key={r.path} {...r} />
            ))}
          </Routes>
        </Header>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
