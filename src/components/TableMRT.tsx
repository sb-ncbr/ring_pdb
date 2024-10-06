import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  type MRT_ColumnDef,
  type MRT_SortingState,
  MRT_TableHeadCellFilterContainer,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { RowData, APIData } from '../data/dataTypes';
import axios from 'axios';
import { columnsData } from '../data/columnData.tsx';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';

const TableMRT = () => {
  const columns = useMemo<MRT_ColumnDef<RowData>[]>(() => columnsData, []);
  const [data, setData] = useState<APIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [isCompactView, setIsCompactView] = useState(false);
  const columnDefaultState = {
    experimental_method: true,
    rsr: true,
    rscc: true,
    ligand_coverage: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(columnDefaultState);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  useEffect(() => {
    if (isCompactView) {
      setColumnVisibility({
        experimental_method: false,
        rsr: false,
        rscc: false,
        ligand_coverage: false,
      });
    } else {
      setColumnVisibility(columnDefaultState);
    }
  }, [isCompactView]);

  useEffect(() => {
    axios
      .get<{ rows: APIData[] }>('http://localhost:5000/api/data')
      .then((response) => {
        setData(response.data.rows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
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
    columnFilterDisplayMode: 'custom',
    enableFacetedValues: true,
    defaultColumn: {
      minSize: 20,
      maxSize: 300,
      size: 40,
      muiTableHeadCellProps: {
        sx: {
          fontSize: '12px',
          fontWeight: '300',
        },
      },
      // muiFilterTextFieldProps: {
      //   sx: { width: '160px' },
      // },
    },
    initialState: {
      density: 'compact',
      showColumnFilters: true,
    },
    enableColumnActions: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enablePagination: true,
    enableRowNumbers: false,
    muiTableContainerProps: { sx: { maxHeight: '600px' } },
    onSortingChange: setSorting,
    isMultiSortEvent: () => true,
    state: { isLoading, sorting, columnVisibility },
    renderTopToolbar: () => {
      const defaultFilterKeys = ['ring_type', 'conformation'];
      const advancedFilterKeys = [
        'ccd_id',
        'pdb_id',
        'experimental_method',
        'resolution',
        'ring_coverage',
        'ligand_coverage',
        'rsr',
        'rscc',
      ];

      function renderFilters(filterKeys: string[]) {
        return (
          <Box sx={{ display: 'flex', gap: '36px', padding: '8px' }}>
            {filterKeys.map((id) => {
              const header = table
                .getHeaderGroups()
                .flatMap((headerGroup) => headerGroup.headers)
                .find((header) => header.id === id);

              if (!header) return null;

              return <MRT_TableHeadCellFilterContainer key={id} header={header} table={table} />;
            })}
          </Box>
        );
      }

      return (
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
          }}
        >
          <Box>
            {/* Default Filters */}
            <Box>{renderFilters(defaultFilterKeys)}</Box>

            {/* Advanced Filters with Grow Transition */}
            <Grow
              in={showAdvancedFilters}
              timeout={{ enter: 700, exit: 1000 }}
              style={{ transformOrigin: '0 0 0' }}
              easing={{ enter: 'ease-in-out', exit: 'ease-in-out' }}
            >
              <Box>{showAdvancedFilters && <Box>{renderFilters(advancedFilterKeys)}</Box>}</Box>
            </Grow>
          </Box>

          <Box
            sx={{
              marginLeft: 'auto', // Align to the right
              alignSelf: 'flex-start', // Align to the top
            }}
          >
            {/* Toggle Button for Advanced Filters */}
            <FormControlLabel
              control={<Switch checked={showAdvancedFilters} onChange={toggleAdvancedFilter} />}
              label="Show advanced filters"
            />

            <FormControlLabel
              control={
                <Switch checked={isCompactView} onChange={() => setIsCompactView(!isCompactView)} />
              }
              label="Show compact table"
            />
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
              startIcon={<FileDownloadIcon />}
            >
              Download Data
            </Button>
          </Box>
        </Box>
      );
    },
  });

  return (
    <Box sx={{ padding: 0, margin: '0 auto', width: '95%', overflowX: 'hidden' }}>
      <Stack direction="column" gap="8px">
        <MaterialReactTable
          table={table}
          muiTableProps={{
            sx: {
              maxWidth: '100%',
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default TableMRT;
