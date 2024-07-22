import React from "react";
import { Button } from "@mui/material";
import axios, { AxiosResponse } from "axios";

export const ExcelDownload: React.FC = () => {
  const downloadFile = async () => {
    try {
      const response: AxiosResponse<never, never> = await axios.get(
        "/download-excel",
        {
          responseType: "blob",
        },
      );
      const blob: Blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url: string = URL.createObjectURL(blob);
      console.log(url);
      const link: HTMLAnchorElement = document.createElement("a");
      link.href = url;
      link.download = "cyclohex_result_summary.xlsx";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file: ", error);
    }
  };
  return (
    <Button onClick={downloadFile} variant="outlined">
      Download
    </Button>
  );
};
