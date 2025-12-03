import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contex/AuthContex.jsx";
import { ThemeProvider } from "./contex/ThemeContex.jsx";
import { FontSizeProvider } from "./contex/FontContext.jsx";




createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <App />
          </FontSizeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
