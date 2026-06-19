import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import StudyPage from "./pages/StudyPage";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";
import AllPage from "./pages/AllPage";
import NicknamePage from "./pages/NicknamePage";
import { FontSizeProvider } from "./lib/fontsize";
import { getNickname } from "./lib/nickname";
import "./index.css";

function Root() {
  const [nickname, setNickname] = useState<string | null>(getNickname);

  if (!nickname) {
    return <NicknamePage onDone={() => setNickname(getNickname())} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App nickname={nickname} />} />
        <Route path="/study/:id" element={<StudyPage nickname={nickname} />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/all" element={<AllPage nickname={nickname} />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FontSizeProvider>
      <Root />
    </FontSizeProvider>
  </React.StrictMode>
);
