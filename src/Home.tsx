import React from "react";
import { ExcelDownload } from "./ExcelDownload.tsx";

export const Home = () => {
  return (
    <>
      <h3>Download sample cyclohexane results</h3>
      <div>
        <ExcelDownload />
      </div>
    </>
  );
};
