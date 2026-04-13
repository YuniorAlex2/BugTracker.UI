import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);