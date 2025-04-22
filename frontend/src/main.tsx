import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./theme/ThemeContext";
import i18n from "./utils/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <I18nextProvider i18n={i18n} defaultNS={'translation'}>
        <CssBaseline />
        <App />
      </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
