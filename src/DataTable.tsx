import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

interface DataRow {
  id: number;
  Ligand_name: string;
  Ring_ID: string;
  BOAT: number;
  CHAIR: number;
  FLAT: number;
  HALF_CHAIR: number;
  TW_BOAT_LEFT: number;
  TW_BOAT_RIGHT: number;
  MinValue: number;
  Conformation: string;
  Entry_ID: string;
  Experimental_Method: string;
  Release_Date: number;
  Resolution: string;
  Coverage: number;
}

const columns: GridColDef<DataRow>[number] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "Ligand_name", headerName: "Ligand Name", width: 130 },
  { field: "Ring_ID", headerName: "Ring ID", width: 130 },
  { field: "BOAT", headerName: "BOAT", width: 90 },
  { field: "CHAIR", headerName: "CHAIR", width: 90 },
  { field: "FLAT", headerName: "FLAT", width: 90 },
  { field: "HALF_CHAIR", headerName: "HALF CHAIR", width: 120 },
  { field: "TW_BOAT_LEFT", headerName: "TW BOAT LEFT", width: 120 },
  { field: "TW_BOAT_RIGHT", headerName: "TW BOAT RIGHT", width: 120 },
  { field: "MinValue", headerName: "Min Value", width: 90 },
  { field: "Conformation", headerName: "Conformation", width: 130 },
  { field: "Entry_ID", headerName: "Entry ID", width: 90 },
  {
    field: "Experimental_Method",
    headerName: "Experimental Method",
    width: 180,
  },
  { field: "Release_Date", headerName: "Release Date", width: 120 },
  { field: "Resolution", headerName: "Resolution", width: 120 },
  { field: "Coverage", headerName: "Coverage", width: 90 },
];

export const DataTable: React.FC = () => {
  const [rows, setRows] = useState<DataRow[]>([]);

  useEffect(() => {
    axios
      .get<DataRow[]>("http://localhost:5000/api/data")
      .then((response) => {
        console.log(response.data.rows);
        setRows(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
