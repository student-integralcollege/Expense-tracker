
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Suppress Recharts defaultProps deprecation warning in React 18
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === "string" && args[0].includes("Support for defaultProps will be removed")) {
    return;
  }
  originalError(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
