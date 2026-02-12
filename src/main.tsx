import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Bootstrap the React application
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(<App />);
