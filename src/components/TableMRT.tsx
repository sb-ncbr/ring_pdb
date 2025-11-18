import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
  MRT_ColumnFiltersState,
  MRT_TableHeadCellFilterContainer,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { RowData, APIData } from '../data/dataTypes';
import axios from 'axios';
import { commonBodyCellProps, commonHeadCellProps, getColumns } from '../data/columnData.tsx';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { useLocation } from 'react-router-dom';
import RangeSlider from './RangeSlider.tsx';
import Typography from '@mui/material/Typography';
import { InfoTooltip } from './InfoTooltip.tsx';
import {
  advancedFilterKeys,
  columnDefaultState,
  combinedFilters,
  defaultFilterKeys,
  FilterKey,
  getUpdatedFilters,
  level1Filters,
  level2Filters,
  level3Filters,
  sliderFilterKeys,
} from '../helperFunctions/filters.tsx';
import { exportAllData } from '../helperFunctions/helpers.ts';
import Spinner from './Spinner.tsx';
import { ColumnFilter } from '@tanstack/react-table';
import { useApiErrorHandler } from '../hooks/useApiErrorHandler.ts';
// import { getAtoms } from '../pages/RingDetails.tsx';

const TableMRT = () => {
  const location = useLocation();
  const [filterSliderRanges, setFilterSliderRanges] = useState({
    resolution: { min: 1, max: 100, step: 1 },
    ring_coverage: { min: 0, max: 50, step: 0.5 },
    rsr: { min: 0.1, max: 10, step: 0.1 },
    rscc: { min: 0, max: 5, step: 0.2 },
    ligand_coverage: { min: 0, max: 100, step: 5 },
  });
  const [sliderResetCounter, setSliderResetCounter] = useState(0);
  const initialFilters: { id: string; value: any }[] = location.state?.filters
    ? Object.entries(location.state.filters).map(([id, value]) => ({
        id,
        value,
      }))
    : Array.from(combinedFilters.values());

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(!!location.state?.filters);

  const handleColumnFiltersChange = (newFilters: ColumnFilter[]) => {
    const result = getUpdatedFilters({
      newFilters,
      columnFilters,
      level1Filters,
      level2Filters,
      level3Filters,
    });
    setColumnFilters(result.filters);
    if (result.resetLevel) {
      setSliderResetCounter((prev) => prev + 1);
    }
  };

  const memoizedColumns = useMemo<MRT_ColumnDef<RowData>[]>(() => {
    const createFilter =
      (key: FilterKey) =>
      ({ column }: { column: any }) => (
        <RangeSlider
          filterBy={column.columnDef.header}
          minVal={filterSliderRanges[key]?.min}
          maxVal={filterSliderRanges[key]?.max}
          step={filterSliderRanges[key]?.step}
          disabled={filterSliderRanges[key]?.min === undefined}
          value={
            (columnFilters.find((f: any) => f.id === key)?.value as [number, number]) ?? [
              filterSliderRanges[key]?.min ?? 0,
              filterSliderRanges[key]?.max ?? 0,
            ]
          }
          onChange={(newSelectedValues) => {
            const newFilters = columnFilters.filter((f) => f.id !== key);
            if (newSelectedValues && newSelectedValues.length) {
              newFilters.push({ id: key, value: newSelectedValues });
            }
            handleColumnFiltersChange(newFilters);
          }}
          sliderResetCounter={sliderResetCounter}
        />
      );

    return getColumns(columnFilters, handleColumnFiltersChange).map((column) => {
      if (
        column.accessorKey &&
        ['resolution', 'ring_coverage', 'ligand_coverage', 'rsr', 'rscc'].includes(
          column.accessorKey,
        )
      ) {
        return {
          ...column,
          Filter: createFilter(column.accessorKey as FilterKey),
        };
      }
      return column;
    }) as MRT_ColumnDef<RowData>[];
  }, [columnFilters, filterSliderRanges]);
  const resetSliderFilters = () => {
    setSliderResetCounter((prev) => prev + 1);
    setColumnFilters((prevState) => {
      return prevState.map((filter) =>
        sliderFilterKeys.includes(filter.id) ? { ...filter, value: [] } : filter,
      );
    });
  };

  const tableContainerMaxWidth = isCompactView ? '1300px' : '1900px';
  const handleSortingChange = (newSorting: any) => {
    setSorting(newSorting);
  };

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilters((prev) => !prev);
  };

  const { handleApiError } = useApiErrorHandler();

  // clear the filter state on reload
  useEffect(() => {
    if (window.history.state) {
      window.history.replaceState(null, '');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // console.log('Sending filters:', columnFilters);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/data`, {
        pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        filters: columnFilters,
        sorting: sorting,
      })
      .then((response) => {
        const transformedData = response.data.rows.map((item: any) => ({
          ...item,
          img_url: `https://cdn.rcsb.org/images/ccd/labeled/${item.ccd_id[0]}/${item.ccd_id}.svg`,
        }));
        setFilterSliderRanges({ ...response.data.filtersValueRange });
        setData(transformedData);
        setTotalRows(response.data.totalRows);
        setIsLoading(false);
      })
      .catch((error) => {
        handleApiError(error)
        console.error('Error fetching data:', error);
        setIsError(true);
        console.log(isError);
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

  const table = useMaterialReactTable({
    columns: memoizedColumns,
    data,
    muiTableBodyRowProps: ({ row }) => ({
      // title: `Ring Atoms: ${getAtoms(row.original.ring_id)}`,
      onClick: () => {
        const url = `/#/ring-details/${row.original.ring_id}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      sx: {
        cursor: 'pointer',
      },
    }),
    columnFilterDisplayMode: 'custom',
    getRowId: (row) => row['ring_id'],
    defaultColumn: {
      minSize: 10,
      maxSize: 100,
      size: 10,
      muiTableHeadCellProps: {
        ...commonHeadCellProps,
      },
      muiTableBodyCellProps: {
        ...commonBodyCellProps,
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
    localization: {
      noResultsFound: 'No data match the filter you specified.',
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
    paginationDisplayMode: 'default',
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
        maxWidth: tableContainerMaxWidth,
        margin: '0 auto',
        width: 'auto',
      },
    },
    onSortingChange: handleSortingChange,
    isMultiSortEvent: () => false,
    state: { isLoading, sorting, columnVisibility, pagination, columnFilters },

    muiTableBodyProps: {
      sx: {
        ...(isLoading && {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }),
      },
    },
    // Add loading overlay
    renderEmptyRowsFallback: () => (isLoading ? <Spinner /> : null),
    // Ensure empty rows are rendered to maintain height
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
      const visibleFilterKeys = table.getVisibleLeafColumns().map((col) => col.id);
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
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '16px',
                          marginTop: '16px',
                        }}
                      >
                        {/* First Row - First 3 filters */}
                        {advancedFilterKeys
                          .slice(0, 3)
                          .map((key, index) => renderFilters([key], index))}
                      </Box>

                      {/* Second Row - Remaining filters-sliders */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '16px',
                        }}
                      >
                        {advancedFilterKeys
                          .slice(3)
                          .filter((key) => visibleFilterKeys.includes(key))
                          .map((key, index) => (
                            <Box key={key} sx={{ maxWidth: '130px' }}>
                              {renderFilters([key], index)}
                            </Box>
                          ))}
                        <Box sx={{ marginTop: '24px' }}>
                          <InfoTooltip onResetSlider={resetSliderFilters} />
                        </Box>
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
                label={<Typography variant="caption">Show advanced filters</Typography>}
                sx={{
                  '& .MuiTypography-root': {
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
                label={<Typography variant="caption">Show compact table</Typography>}
                sx={{
                  '& .MuiTypography-root': {
                    whiteSpace: 'nowrap',
                  },
                }}
              />

              <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                onClick={() => exportAllData(columnFilters, sorting)}
                startIcon={<FileDownloadIcon sx={{ color: '#7C7C7C' }} />}
                sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap', color: '#3A3A3A' }}
              >
                <Typography variant="caption">Download data</Typography>
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
        // Add a container with relative positioning
        position: 'relative',
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default TableMRT;
