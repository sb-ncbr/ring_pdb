import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import CircularIndeterminate from "./Spinner.tsx";

import { columns } from "../data/columnData";
import { createData } from "../utils/dataHelpers";
import { RowData, APIData } from "../data/dataTypes";

const VirtuosoTableComponents: TableComponents<RowData> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      size={"small"}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: RowData) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}
        >
          {row[column.dataKey as keyof RowData]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export const VirtualizedTable = () => {
  const [dataAPI, setDataAPI] = useState<APIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ rows: APIData[] }>("http://localhost:5000/api/data")
      .then((response) => {
        setDataAPI(response.data.rows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const rows: RowData[] = dataAPI.map((data, _index) =>
    createData(
      _index,
      data.ligand_name,
      data.ring_id,
      data.boat,
      data.chair,
      data.flat,
      data.half_chair,
      data.tw_boat_left,
      data.tw_boat_right,
      data.min_value,
      data.conformation,
      data.entry_id,
      data.experimental_method,
      data.release_date,
      data.resolution,
      data.coverage,
    ),
  );

  return (
    <Box sx={{ height: 400, width: 1500 }}>
      {isLoading ? (
        <CircularIndeterminate />
      ) : (
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      )}
    </Box>
  );
};
