import { ColumnDataMRT } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
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
import React, { useState } from 'react';
import { getChipStyles, isFavorable } from '../helperFunctions/helpers.ts';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export const columnsData: ColumnDataMRT[] = [
  {
    header: 'PDB ID',
    accessorKey: 'pdb_id',
    Filter: ({ column }: { column: any }) => {
      return (
        <FilterAutocomplete
          filterByLabel="PDB ID"
          onChange={(newSelectedValues) => {
            column.setFilterValue(newSelectedValues);
          }}
          selectedValues={(column.getFilterValue() as string[]) || []}
        />
      );
    },
  },
  {
    header: 'CCD ID',
    accessorKey: 'ccd_id',
    Filter: ({ column }: { column: any }) => {
      return (
        <FilterAutocomplete
          filterByLabel="CCD ID"
          onChange={(newSelectedValues) => {
            column.setFilterValue(newSelectedValues);
          }}
          selectedValues={(column.getFilterValue() as string[]) || []}
        />
      );
    },
  },
  {
    header: 'RESIDUE ID',
    accessorKey: 'residue_id',
    enableColumnFilter: false,
    Cell: ({ cell }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'RING TYPE',
    accessorKey: 'ring_type',
    enableSorting: false,
    Filter: ({ column }: { column: any }) => {
      return (
        <FilterAutocompleteSimple
          options={['Cyclohexane', 'Cyclopentane', 'Benzene']}
          filterByLabel="ring type"
          selectedValues={(column.getFilterValue() as string[]) || []}
          onChange={(newSelectedValues) => {
            column.setFilterValue(newSelectedValues);
          }}
        />
      );
    },
    Cell: ({ cell }) => {
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
    Cell: ({ cell }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'RING COVERAGE [%]',
    accessorKey: 'ring_coverage',
    filterVariant: 'text',
    Cell: ({ cell }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'CONFORMATION',
    accessorKey: 'conformation',
    enableSorting: false,
    Filter: ({ column }: { column: any }) => {
      const filterValue = column.getFilterValue() || {};
      const selectedValues = filterValue.selectedValues || [];
      const showFavorable = filterValue.showFavorable ?? true;
      const showUnfavorable = filterValue.showUnfavorable ?? true;

      const handleSwitchChange = (key: 'showFavorable' | 'showUnfavorable', value: boolean) => {
        column.setFilterValue({
          ...filterValue,
          [key]: value,
        });
      };

      const handleAutocompleteChange = (newSelectedValues: string[]) => {
        column.setFilterValue({
          ...filterValue,
          selectedValues: newSelectedValues,
        });
      };

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FilterAutocompleteSimple
            options={['Boat', 'Envelope', 'Chair', 'Half chair', 'Flat', 'Twist boat']}
            filterByLabel="conformation"
            selectedValues={selectedValues}
            onChange={handleAutocompleteChange}
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

    filterFn: (row: any, columnId: any, filterValue: any) => {
      const conf = row.original[columnId];
      const ring = row.original.ring_type;
      const favorable = isFavorable(ring, conf);

      const { selectedValues = [], showFavorable = true, showUnfavorable = true } = filterValue;
      const matchesAutocomplete = selectedValues.length === 0 || selectedValues.includes(conf);
      const matchesSwitches = (favorable && showFavorable) || (!favorable && showUnfavorable);
      return matchesAutocomplete && matchesSwitches;
    },

    Cell: ({ row }) => {
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
    Cell: ({ cell }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'EXPERIMENTAL METHOD',
    accessorKey: 'experimental_method',
    enableSorting: false,
    Filter: ({ column }: { column: any }) => {
      return (
        <FilterAutocompleteSimple
          options={[
            'X-ray diffraction',
            'Solution NMR',
            'Electron microscopy',
            'Electron crystallography',
            'Solid-state NMR',
            'Solution scattering',
            'Neutron diffraction',
            'Powder diffraction',
            'Hybrid method',
          ]}
          filterByLabel="experimental method"
          selectedValues={(column.getFilterValue() as string[]) || []}
          onChange={(newSelectedValues) => {
            column.setFilterValue(newSelectedValues);
          }}
        />
      );
    },
    Cell: ({ cell }) => {
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
    Cell: ({ cell }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'RSCC',
    accessorKey: 'rscc',
    filterVariant: 'text',
    Cell: ({ cell }) => (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{cell.getValue<number>()}</Typography>
      </Box>
    ),
  },
  {
    header: 'LIGAND COVERAGE [%]',
    accessorKey: 'ligand_coverage',
    filterVariant: 'text',
    Cell: ({ cell }) => (
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
    Cell: ({ cell, row }) => {
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
