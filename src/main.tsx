import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import StudyPage from "./pages/StudyPage";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";
import AllPage from "./pages/AllPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/study/:id" element={<StudyPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/all" element={<AllPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
