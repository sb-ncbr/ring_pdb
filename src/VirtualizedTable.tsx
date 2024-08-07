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

interface RowData {
  id: number;
  ligand_name: string;
  ring_id: string;
  boat: number;
  chair: number;
  flat: number;
  half_chair: number;
  tw_boat_left: number;
  tw_boat_right: number;
  min_value: number;
  conformation: string;
  entry_id: string;
  experimental_method: string;
  release_date: number;
  resolution: number;
  coverage: number | null;
}

interface ColumnData {
  dataKey: keyof RowData;
  label: string;
  numeric?: boolean;
  width: number;
}

function createData(
  id: number,
  ligand_name: string,
  ring_id: string,
  boat: number,
  chair: number,
  flat: number,
  half_chair: number,
  tw_boat_left: number,
  tw_boat_right: number,
  min_value: number,
  conformation: string,
  entry_id: string,
  experimental_method: string,
  release_date: number,
  resolution: number,
  coverage: number | null,
): RowData {
  console.log("Inside createData, ligand name is: ", ligand_name);
  return {
    id,
    ligand_name,
    ring_id,
    boat,
    chair,
    flat,
    half_chair,
    tw_boat_left,
    tw_boat_right,
    min_value,
    conformation,
    entry_id,
    experimental_method,
    release_date,
    resolution,
    coverage,
  };
}

const columns: ColumnData[] = [
  {
    width: 40,
    label: "Ligand name",
    dataKey: "ligand_name",
  },
  {
    width: 70,
    label: "Ring ID",
    dataKey: "ring_id",
  },
  {
    width: 40,
    label: "Boat",
    dataKey: "boat",
    numeric: true,
  },
  {
    width: 40,
    label: "Chair",
    dataKey: "chair",
    numeric: true,
  },
  {
    width: 40,
    label: "Flat",
    dataKey: "flat",
    numeric: true,
  },
  {
    width: 80,
    label: "Half chair",
    dataKey: "half_chair",
    numeric: true,
  },
  {
    width: 100,
    label: "Twist boat left",
    dataKey: "tw_boat_left",
    numeric: true,
  },
  {
    width: 100,
    label: "Twist boat right",
    dataKey: "tw_boat_right",
    numeric: true,
  },
  {
    width: 40,
    label: "Min value",
    dataKey: "min_value",
    numeric: true,
  },
  {
    width: 100,
    label: "Conformation",
    dataKey: "conformation",
  },
  {
    width: 40,
    label: "Entry ID",
    dataKey: "entry_id",
  },
  {
    width: 120,
    label: "Experimental method",
    dataKey: "experimental_method",
  },
  {
    width: 70,
    label: "Release date",
    dataKey: "release_date",
    numeric: true,
  },
  {
    width: 60,
    label: "Resolution",
    dataKey: "resolution",
    numeric: true,
  },
  {
    width: 60,
    label: "Coverage",
    dataKey: "coverage",
  },
];

type APIData = Readonly<Omit<RowData, "id">>;

const VirtuosoTableComponents: TableComponents<RowData> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
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
  console.log("Row Content:", row);
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
        console.log("API Response:", typeof response.data);
        setDataAPI(response.data.rows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const rows: RowData[] = dataAPI.map((data, _index) => {
    const rowData = createData(
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
    );
    return rowData;
  });

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
