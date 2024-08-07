/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout.tsx";
import { Home } from "./Home.tsx";
import NoPage from "./components/NoPage.tsx";
import PlaygroundMain from "./components/Playground.tsx";
import TableMRT from "./components/TableMRT.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="api/data" element={<TableMRT />} />
          <Route path="playground" element={<PlaygroundMain />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
