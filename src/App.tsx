/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResultPage } from "./ResultPage.tsx";
import { Layout } from "./Layout.tsx";
import { Home } from "./Home.tsx";
import NoPage from "./NoPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="conf-comparer/results/:jobID" element={<ResultPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
