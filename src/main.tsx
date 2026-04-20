import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { VehicleProvider } from "./context/VehicleContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <VehicleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VehicleProvider>
    </ThemeProvider>
  </React.StrictMode>
);
