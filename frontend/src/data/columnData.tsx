import React, { useState } from 'react';
import { RingCards, RingType, RowData } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { MRT_Cell, MRT_Column, MRT_Row, MRT_ColumnDef } from 'material-react-table';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormGroup,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAutocomplete from '../components/FilterAutocomplete.tsx';
import { FilterAutocompleteSimple } from '../components/FilterAutocompleteSimple.tsx';
import { getChipStyles, getOtherSelectedFilters, isFavorable } from '../helperFunctions/helpers.ts';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ringCards from '../content/ringCards.json';
import { TableCellProps } from '@mui/material';
import { useSmartSwitch } from '../lib/hooks/use-smart-switch.ts';
import { formatNumber } from '../lib/utils.ts';
import {
  getFavorabilityFlags,
  getOptions,
} from '../helperFunctions/ringUtils.ts';

export const commonHeadCellProps: TableCellProps = {
  align: 'center',
  sx: {
    fontSize: '0.8rem',
    fontWeight: '300',
    maxWidth: '100px',
    verticalAlign: 'middle',
  },
};

export const commonBodyCellProps = {
  sx: {
    paddingLeft: '42px',
    paddingRight: '42px',
  },
};

export const getColumns = (
  columnFilters: any,
  handleColumnFiltersChange: any,
): MRT_ColumnDef<RowData>[] => [
  {
    header: 'PDB ID',
    accessorKey: 'pdb_id',
    Filter: ({ column }: { column: MRT_Column<RowData> }) => {
      const otherSelectedFilters = getOtherSelectedFilters(columnFilters, 'pdb_id');
      return (
        <FilterAutocomplete
          filterByLabel="PDB ID"
          selectedValues={columnFilters.find((f: any) => f.id === column.id)?.value || []}
          onChange={(newSelectedValues) => {
            const newFilters = [
              ...columnFilters.filter((f: any) => f.id !== column.id),
              { id: column.id, value: newSelectedValues },
            ];
            handleColumnFiltersChange(newFilters);
          }}
          otherSelectedFilters={otherSelectedFilters}
        />
      );
    },
  },
  {
    header: 'CCD ID',
    accessorKey: 'ccd_id',
    Filter: ({ column }: { column: MRT_Column<RowData> }) => {
      const otherSelectedFilters = getOtherSelectedFilters(columnFilters, 'ccd_id');
      return (
        <FilterAutocomplete
          filterByLabel="CCD ID"
          selectedValues={columnFilters.find((f: any) => f.id === column.id)?.value || []}
          onChange={(newSelectedValues) => {
            const newFilters = [
              ...columnFilters.filter((f: any) => f.id !== column.id),
              { id: column.id, value: newSelectedValues },
            ];
            handleColumnFiltersChange(newFilters);
          }}
          otherSelectedFilters={otherSelectedFilters}
        />
      );
    },
  },
  {
    header: 'RESIDUE ID',
    accessorKey: 'residues',
    enableColumnFilter: false,
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'RING TYPE',
    accessorKey: 'ring_type',
    enableSorting: false,
    muiTableHeadCellProps: {
      ...commonHeadCellProps,
      sx: {
        ...commonHeadCellProps.sx,
        width: '160px',
      },
    },
    muiTableBodyCellProps: {
      ...commonBodyCellProps,
      align: 'center',
      sx: {
        width: '160px',
      },
    },
    Filter: ({ column, table }: { column: MRT_Column<RowData>; table: any }) => {
      const selectedValues = columnFilters.find((f: any) => f.id === column.id)?.value || [];

      const confTypeFilter: string[] | undefined = table
        .getState()
        .columnFilters.find((f: any) => f.id === 'conformation')?.value.selectedValues;

      const ringsByConformation: Record<string, string[]> = {};

      for (const ring of ringCards.rings) {
        for (const conf of ring.confs) {
          if (!ringsByConformation[conf.name]) {
            ringsByConformation[conf.name] = [];
          }
          ringsByConformation[conf.name].push(ring.name);
        }
      }

      const ringOptions: string[] =
        confTypeFilter && confTypeFilter.length > 0
          ? Array.from(new Set(confTypeFilter.flatMap((conf) => ringsByConformation[conf] || [])))
          : ringCards.rings.map((ring) => ring.name);

      return (
        <FilterAutocompleteSimple
          options={ringOptions}
          filterByLabel="ring type"
          selectedValues={selectedValues}
          onChange={(newSelectedValues) => {
            const newFilters = [
              ...columnFilters.filter((f: any) => f.id !== column.id),
              { id: column.id, value: newSelectedValues },
            ];
            handleColumnFiltersChange(newFilters);
          }}
        />
      );
    },
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => {
      const ringType = cell.getValue<string>();
      const theme = useTheme();
      return (
        <Chip
          label={<Typography variant="body2">{ringType}</Typography>}
          sx={{ ...getChipStyles(ringType, theme), color: '#000', width: 123 }}
        />
      );
    },
  },
  {
    header: 'RESOLUTION [Å]',
    accessorKey: 'resolution',
    muiTableHeadCellProps: {
      ...commonHeadCellProps,
      sx: {
        ...commonHeadCellProps.sx,
        width: '160px',
      },
    },
    muiTableBodyCellProps: {
      ...commonBodyCellProps,
      sx: {
        ...commonBodyCellProps.sx,
        width: '160px',
      },
    },
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{formatNumber(cell.getValue<number>(), 2)}</Typography>
      </Box>
    ),
  },
  {
    header: 'RING COVERAGE [%]',
    accessorKey: 'ring_coverage',
    filterVariant: 'text',
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'CONFORMATION',
    accessorKey: 'conformation',
    enableSorting: false,
    Filter: ({ column, table }: { column: MRT_Column<RowData>; table: any }) => {
      const filterValue =
        columnFilters.find((f: any) => {
          return f.id === column.id;
        })?.value || [];
      const selectedValues = filterValue.selectedValues || [];

      const ringTypeFilter: RingType[] | undefined = table
        .getState()
        .columnFilters.find((f: any) => f.id === 'ring_type')?.value;

      // Determine selected ring types
      const selectedRingTypes: RingType[] = Array.isArray(ringTypeFilter) ? ringTypeFilter : [];

      // Collect applicable conformations from selected ring types. if nothing selected -> show all variants
      const options = getOptions(ringCards as RingCards, selectedRingTypes)
      const [hasFav, hasUnfav] = getFavorabilityFlags(selectedValues, selectedRingTypes)

      const favorableSwitch = useSmartSwitch(hasFav);
      const unfavorableSwitch = useSmartSwitch(hasUnfav);

      const handleSwitchChange = (key: 'showFavorable' | 'showUnfavorable', value: boolean) => {
        const currentFilterValue = columnFilters.find((f: any) => f.id === column.id)?.value || {};

        const newFilterValue = {
          ...currentFilterValue,
          [key]: value,
        };

        const newFilters = [
          ...columnFilters.filter((f: any) => f.id !== column.id),
          { id: column.id, value: newFilterValue },
        ];

        handleColumnFiltersChange(newFilters);
      };

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FilterAutocompleteSimple
            options={options}
            filterByLabel="conformation"
            selectedValues={selectedValues}
            onChange={(newSelectedValues) => {
              const newFilters = [
                ...columnFilters.filter((f: any) => f.id !== column.id),
                {
                  id: column.id,
                  value: {
                    ...filterValue,
                    selectedValues: newSelectedValues,
                  },
                },
              ];
              handleColumnFiltersChange(newFilters);
            }}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={favorableSwitch.value}
                  onChange={(e) => {
                    favorableSwitch.setValue(e.target.checked);
                    handleSwitchChange('showFavorable', e.target.checked);
                  }}
                  disabled={favorableSwitch.disabled || table.getState().isLoading}
                />
              }
              label={<Typography variant="body1">Show favorable</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={unfavorableSwitch.value}
                  onChange={(e) => {
                    unfavorableSwitch.setValue(e.target.checked);
                    handleSwitchChange('showUnfavorable', e.target.checked);
                  }}
                  disabled={unfavorableSwitch.disabled || table.getState().isLoading}
                />
              }
              label={<Typography variant="body1">Show unfavorable</Typography>}
            />
          </FormGroup>
        </Box>
      );
    },
    Cell: ({ row }: { row: MRT_Row<RowData> }) => {
      const conf = row.original.conformation;
      const ring = row.original.ring_type;
      const favorable = isFavorable(ring, conf);
      const mainColor = favorable ? '#2587E2' : '#CD4139';

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '16px',
          }}
        >
          <Typography variant="body2">{row.original.conformation}</Typography>

          <Chip
            label={
              <Typography variant="caption">{favorable ? 'favorable' : 'unfavorable'}</Typography>
            }
            size="small"
            variant="outlined"
            sx={{ borderColor: mainColor, color: mainColor }}
          />
        </Box>
      );
    },
  },
  {
    header: 'RMSD [Å]',
    accessorKey: 'rmsd',
    enableColumnFilter: false,
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{formatNumber(cell.getValue<number>(), 3)}</Typography>
      </Box>
    ),
  },
  {
    header: 'EXPERIMENTAL METHOD',
    accessorKey: 'experimental_method',
    enableSorting: false,
    Filter: ({ column }: { column: MRT_Column<RowData> }) => {
      const otherSelectedFilters = getOtherSelectedFilters(columnFilters, 'experimental_method');
      return (
        <FilterAutocompleteSimple
          options={[]}
          filterByLabel="experimental method"
          selectedValues={columnFilters.find((f: any) => f.id === column.id)?.value || []}
          onChange={(newSelectedValues) => {
            const newFilters = [
              ...columnFilters.filter((f: any) => f.id !== column.id),
              { id: column.id, value: newSelectedValues },
            ];
            handleColumnFiltersChange(newFilters);
          }}
          otherSelectedFilters={otherSelectedFilters}
        />
      );
    },
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => {
      const text = cell.getValue<string>();
      return (
        <Box
          sx={{
            whiteSpace: 'normal',
          }}
        >
          {
            <Typography
              variant="body2"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                textWrap: 'nowrap',
              }}
            >
              {text}
            </Typography>
          }
        </Box>
      );
    },
  },
  {
    header: 'RSR',
    accessorKey: 'rsr',
    filterVariant: 'text',
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{formatNumber(cell.getValue<number>(), 2)}</Typography>
      </Box>
    ),
  },
  {
    header: 'RSCC',
    accessorKey: 'rscc',
    filterVariant: 'text',
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{formatNumber(cell.getValue<number>(), 3)}</Typography>
      </Box>
    ),
  },
  {
    header: 'LIGAND COVERAGE [%]',
    accessorKey: 'ligand_coverage',
    filterVariant: 'text',
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: '2D STRUCTURE',
    accessorKey: 'img_url',
    enableSorting: false,
    enableColumnFilter: false,
    muiTableBodyCellProps: {
      sx: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    Cell: ({ cell, row }: { cell: MRT_Cell<RowData>; row: any }) => {
      const [openOverlay, setOpenOverlay] = useState(false);
      const handleShowImage = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        event.stopPropagation();
        setOpenOverlay(true);
      };
      const handleCloseOverlay = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        setOpenOverlay(false);
      };

      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={cell.getValue<string>()}
            alt={`'Vector graphics of ligand' ${row.original.ccd_id}`}
            style={{
              maxHeight: 50,
              margin: -10,
              cursor: 'pointer',
            }}
            onClick={handleShowImage}
          />

          {/* Overlay Modal */}
          <Dialog open={openOverlay} onClose={handleCloseOverlay} fullWidth maxWidth="lg">
            <DialogActions>
              <IconButton
                onClick={handleCloseOverlay}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogActions>
            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">
                Ring atoms: {row.original.ring_id.split('_')[4].replace('/-/g', ' ')}
              </Typography>
              <Box
                component="img"
                src={cell.getValue<string>()}
                alt={`Vector graphics of ligand ${row.original.ccd_id}`}
                sx={{
                  maxWidth: '60%',
                  maxHeight: '70vh',
                  marginBottom: 2,
                  objectFit: 'contain',
                }}
              />
              {/*<Typography variant="h6" mt={2}>*/}
              {/*  Ligand {row.original.ccd_id}*/}
              {/*</Typography>*/}
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
