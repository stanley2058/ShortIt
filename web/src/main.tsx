import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./components/Home";
import Manage from "./components/Manage";
import "./index.css";
import Header from "./components/Header";
import About from "./components/About";

const router = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/manage",
    element: <Manage />,
  },
  {
    path: "/about",
    element: <About />,
  },
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header>
        <Routes>
          {router.map((r) => (
            <Route key={r.path} {...r} />
          ))}
        </Routes>
      </Header>
    </BrowserRouter>
  </React.StrictMode>
);
