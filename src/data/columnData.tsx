import React, { useState } from 'react';
import { RingType, RowData } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { MRT_Cell, MRT_Column, MRT_Row } from 'material-react-table';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import FilterAutocomplete from '../components/FilterAutocomplete.tsx';
import { FilterAutocompleteSimple } from '../components/FilterAutocompleteSimple.tsx';
import { getChipStyles, getOtherSelectedFilters, isFavorable } from '../helperFunctions/helpers.ts';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ringCards from '../content/ringCards.json';

export const getColumns = (columnFilters: any, handleColumnFiltersChange: any) => [
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
    accessorKey: 'residue_id',
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
    Filter: ({ column }: { column: MRT_Column<RowData> }) => {
      const selectedValues = columnFilters.find((f: any) => f.id === column.id)?.value || [];
      return (
        <FilterAutocompleteSimple
          options={ringCards.rings.map((ring) => ring.name)}
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
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
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
      const showFavorable = filterValue.showFavorable ?? true;
      const showUnfavorable = filterValue.showUnfavorable ?? true;

      const ringTypeFilter: RingType[] | undefined = table
        .getState()
        .columnFilters.find((f: any) => f.id === 'ring_type')?.value;

      const conformationByRingType = ringCards.rings.reduce(
        (acc, ring) => {
          acc[ring.name] = ring.confs.map((conf) => conf.name);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      // Determine selected ring types
      const selectedRingTypes: RingType[] = Array.isArray(ringTypeFilter) ? ringTypeFilter : [];

      const ringTypes = Object.keys(conformationByRingType) as RingType[];
      // Collect applicable conformations from selected ring types. if nothing selected -> show all variants
      const options = selectedRingTypes.length
        ? Array.from(
            new Set(
              selectedRingTypes.flatMap((rt) =>
                ringTypes.includes(rt) ? conformationByRingType[rt as RingType] : [],
              ),
            ),
          )
        : Array.from(new Set(Object.values(conformationByRingType).flat()));

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
                  checked={showFavorable}
                  onChange={(e) => handleSwitchChange('showFavorable', e.target.checked)}
                />
              }
              label={<Typography variant="body1">Show favorable</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showUnfavorable}
                  onChange={(e) => handleSwitchChange('showUnfavorable', e.target.checked)}
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
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
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
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'RSCC',
    accessorKey: 'rscc',
    filterVariant: 'text',
    Cell: ({ cell }: { cell: MRT_Cell<RowData> }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
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
    header: 'DETAILS',
    accessorKey: 'img_url',
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ cell, row }: { cell: MRT_Cell<RowData>; row: any }) => {
      const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(
        null,
      );
      const [openOverlay, setOpenOverlay] = useState(false);

      const handleContextMenu: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();
        setContextMenu({
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        });
      };
      const handleCloseContextMenu = () => {
        setContextMenu(null);
      };
      const handleShowImage = () => {
        setOpenOverlay(true);
        handleCloseContextMenu();
      };
      const handleCloseOverlay = () => {
        setOpenOverlay(false);
      };

      return (
        <>
          <Link
            to={`/ring-details/${row.original.ring_id}`}
            target="_blank"
            rel="noopener noreferrer"
            // underline="none"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onContextMenu={handleContextMenu}
          >
            <img
              src={cell.getValue<string>()}
              alt={`'Vector graphics of ligand' ${row.original.ccd_id}`}
              style={{ maxHeight: 50, margin: -10 }}
            />
          </Link>
          <Menu
            open={contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleShowImage}>Show Image</MenuItem>
          </Menu>
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
        </>
      );
    },
  },
];
