import { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  type MRT_ColumnDef,
  type MRT_SortingState,
  type MRT_RowVirtualizer,
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
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [data, setData] = useState<APIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

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

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

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

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        ring_id: false,
        chair: false,
        flat: false,
        boat: false,
        half_chair: false,
        tw_boat_left: false,
        tw_boat_right: false,
      },
    },
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableRowNumbers: false,
    enableRowVirtualization: true,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    onSortingChange: setSorting,
    isMultiSortEvent: () => true,
    state: { isLoading, sorting },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 5 },
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
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default TableMRT;
