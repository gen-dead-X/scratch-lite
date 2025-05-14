import { StrictMode } from "react";
import { AnimationProvider } from "./context/AnimationContext";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "tailwindcss/index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AnimationProvider>
    <App />
  </AnimationProvider>
  // </StrictMode>
);
