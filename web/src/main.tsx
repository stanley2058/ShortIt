import { Text } from "@mantine/core";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import "@mantine/core/styles.css";
import "./index.css";

const Home = lazy(() => import("./components/Home"));
const Manage = lazy(() => import("./components/Manage"));
const Header = lazy(() => import("./components/Header"));
const About = lazy(() => import("./components/About"));
const NotFound = lazy(() => import("./components/404"));

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
  {
    path: "*",
    element: <NotFound />,
  },
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header>
        <Suspense fallback={<Text>Loading body...</Text>}>
          <Routes>
            {router.map((r) => (
              <Route key={r.path} {...r} />
            ))}
          </Routes>
        </Suspense>
      </Header>
    </BrowserRouter>
  </React.StrictMode>
);
