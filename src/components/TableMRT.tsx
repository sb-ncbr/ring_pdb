import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  type MRT_ColumnDef,
  type MRT_SortingState,
} from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { RowData, APIData } from "../data/dataTypes";
import axios from "axios";
import { columnsCyclohex } from "../data/columnData.ts";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

const TableMRT = () => {
  const columns = useMemo<MRT_ColumnDef<RowData>[]>(() => columnsCyclohex, []);
  const [data, setData] = useState<APIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [isCompactView, setIsCompactView] = useState(false);
  const columnDefaultState = {
    ring_id: true,
    chair: true,
    flat: true,
    boat: true,
    half_chair: true,
    tw_boat_left: true,
    tw_boat_right: true,
  }
  const [columnVisibility, setColumnVisibility] = useState(columnDefaultState);

  useEffect(() => {
    if (isCompactView) {
      setColumnVisibility({
        ring_id: false,
        chair: false,
        flat: false,
        boat: false,
        half_chair: false,
        tw_boat_left: false,
        tw_boat_right: false,
      });
    } else {
      setColumnVisibility(columnDefaultState);
    }
  }, [isCompactView]);

  useEffect(() => {
    axios
      .get<{ rows: APIData[] }>("http://localhost:5000/api/data")
      .then((response) => {
        setData(response.data.rows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<RowData>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      density: 'compact',
    },
    enableColumnActions: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enablePagination: true,
    enableRowNumbers: false,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    onSortingChange: setSorting,
    isMultiSortEvent: () => true,
    state: { isLoading, sorting, columnVisibility },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Download Data
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCompactView(!isCompactView)}
        >
          {isCompactView ? "Switch to detailed view" : "Switch to compact view"}
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default TableMRT;
