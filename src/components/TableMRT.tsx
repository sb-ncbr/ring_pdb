import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  type MRT_ColumnDef,
  type MRT_SortingState,
  MRT_TableHeadCellFilterContainer,
  MRT_ColumnFiltersState,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { RowData, APIData } from '../data/dataTypes';
import axios from 'axios';
import { columnsData } from '../data/columnData.tsx';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { useLocation } from 'react-router-dom';
import RangeSlider from './RangeSlider.tsx';

const TableMRT = () => {
  const location = useLocation();
  const [filterSliderRanges, setFilterSliderRanges] = useState({
    resolution: {},
    ring_coverage: {},
    rsr: {},
    rscc: {},
  });

  const memoizedColumns = useMemo<MRT_ColumnDef<RowData>[]>(() => {
    const createFilter =
      (key) =>
      ({ column }) => (
        <RangeSlider
          filterBy={column.columnDef.header}
          minVal={filterSliderRanges[key]?.min}
          maxVal={filterSliderRanges[key]?.max}
          step={0.01}
          disabled={filterSliderRanges[key]?.min === undefined}
        />
      );

    return columnsData.map((column) => {
      if (['resolution', 'ring_coverage', 'rsr', 'rscc'].includes(column.accessorKey)) {
        return {
          ...column,
          Filter: createFilter(column.accessorKey),
        };
      }
      return column;
    }) as MRT_ColumnDef<RowData>[];
  }, [filterSliderRanges]);

  const tableContainerMaxWidth = '1900px';
  const columnDefaultState = {
    experimental_method: true,
    rsr: true,
    rscc: true,
    ligand_coverage: false,
  };
  const defaultFilterKeys = ['ring_type', 'conformation'];
  const advancedFilterKeys = [
    'pdb_id',
    'ccd_id',
    'experimental_method',
    'resolution',
    'ring_coverage',
    'ligand_coverage',
    'rsr',
    'rscc',
  ];
  const previousFilters = location.state?.filters
    ? Object.entries(location.state.filters).map(([id, value]) => ({
        id, // columnKey
        value,
      }))
    : [];
  const initialFilters = [
    ...previousFilters,
    ...advancedFilterKeys.map((id) => ({ id, value: [] })),
  ];
  const [data, setData] = useState<APIData[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [isCompactView, setIsCompactView] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState(columnDefaultState);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
  };

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .post('http://localhost:5000/api/data', {
        pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        filters: columnFilters,
        sorting: sorting,
      })
      .then((response) => {
        console.log(response);
        const transformedData = response.data.rows.map((item) => ({
          ...item,
          img_url: `https://cdn.rcsb.org/images/ccd/labeled/${item.ccd_id[0]}/${item.ccd_id}.svg`,
        }));
        setFilterSliderRanges({ ...response.data.filtersValueRange });
        setData(transformedData);
        setTotalRows(response.data.totalRows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsError(true);
        return;
      });
  }, [pagination.pageIndex, pagination.pageSize, columnFilters, sorting]);

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
    columns: memoizedColumns,
    data,
    columnFilterDisplayMode: 'custom',
    getRowId: (row) => row['Ring ID'],
    // enableFacetedValues: true,
    defaultColumn: {
      minSize: 10,
      maxSize: 100,
      size: 10,
      muiTableHeadCellProps: {
        sx: {
          fontSize: '0.8rem',
          fontWeight: '300',
          maxWidth: '100px',
        },
      },
      muiFilterTextFieldProps: {
        sx: {
          '& .MuiInputBase-input': {
            color: '#434242',
            fontSize: '0.9rem',
          },
          '& .MuiBox-root': {
            opacity: 1,
          },
        },
      },
    },
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: true,
      variant: 'text',
    },
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    rowCount: totalRows,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    paginationDisplayMode: 'pages',
    initialState: {
      density: 'compact',
      showColumnFilters: true,
    },
    enableStickyHeader: true,
    enableColumnActions: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enablePagination: true,
    muiTableContainerProps: {
      sx: {
        maxHeight: '1000px',
        maxWidth: tableContainerMaxWidth,
        margin: '0 auto',
        width: 'auto',
      },
    },
    onSortingChange: handleSortingChange,
    isMultiSortEvent: () => false,
    state: { isLoading, sorting, columnVisibility, pagination, columnFilters },
    renderTopToolbar: () => {
      function renderFilters(filterKeys: string[], index?: number) {
        return (
          <Box key={index} sx={{ display: 'flex', gap: '16px', padding: '2px', flexWrap: 'wrap' }}>
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
        <>
          <Box
            sx={{
              display: 'flex',
              padding: '16px 2px',
              m: '2px 12px',
              gap: '48px',
            }}
          >
            {/* Right toolbar */}
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
                <Box>
                  {showAdvancedFilters && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        marginTop: '16px',
                      }}
                    >
                      {/* First Row - First 3 filters */}
                      {advancedFilterKeys
                        .slice(0, 3)
                        .map((key, index) => renderFilters([key], index))}

                      {/* Second Row - Remaining filters-sliders */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '16px',
                        }}
                      >
                        {advancedFilterKeys.slice(3).map((key) => (
                          <Box key={key} sx={{ maxWidth: '130px' }}>
                            {renderFilters([key])}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grow>
            </Box>

            {/* Left toolbar */}
            <Box
              sx={{
                marginLeft: 'auto', // Align to the right
                alignSelf: 'flex-end', // Align to the top
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {/* Toggle Button for Advanced Filters */}

              <FormControlLabel
                control={<Switch checked={showAdvancedFilters} onChange={toggleAdvancedFilter} />}
                label="Show advanced filters"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={isCompactView}
                    onChange={() => setIsCompactView(!isCompactView)}
                  />
                }
                label="Show compact table"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                  },
                }}
              />

              <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                startIcon={<FileDownloadIcon sx={{ color: '#7C7C7C' }} />}
                sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap', color: '#3A3A3A' }}
              >
                Download Data
              </Button>
            </Box>
          </Box>
          <Divider sx={{ marginBottom: '5px' }} />
        </>
      );
    },
  });

  return (
    <Box
      sx={{
        margin: '0 8px',
        '.MuiTableHead-root .MuiIconButton-root': {
          display: 'none',
        },
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default TableMRT;
