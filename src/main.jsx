import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MainProvider } from "./services/context/MainContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <CookiesProvider
    defaultSetOptions={{ path: "/", httpOnly: true, sameSite: "none" }}
  >
    <BrowserRouter>
      <MainProvider>
        <App />
      </MainProvider>
    </BrowserRouter>
  </CookiesProvider>
  // </StrictMode>
);
