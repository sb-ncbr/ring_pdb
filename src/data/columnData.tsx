import { ColumnDataMRT } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import RangeSlider from '../components/RangeSlider.tsx';
import FilterAutocomplete from '../components/FilterAutocomplete.tsx';
import { generateUniqueOptions } from './testGeneratedData.ts';
import { FilterAutocompleteSimple } from '../components/FilterAutocompleteSimple.tsx';
import ringCards from '../content/ringCards.json';
import { useState } from 'react';

const isFavorable = (ringName, confName) => {
  const ring = ringCards.rings.find((r) => r.name.toLowerCase() === ringName.toLowerCase());

  if (!ring) return null;
  const conf = ring.confs.find((c) => {
    return c.name === confName;
  });
  return conf ? conf.favorable : null;
};

const pdbOptions: string[] = generateUniqueOptions(100, 'pdb');
const ccdOptions: string[] = generateUniqueOptions(100, 'ccd');

export const getChipStyles = (type: string, theme) => {
  switch (type) {
    case 'Cyclohexane':
      return { backgroundColor: theme.palette.custom.paleGreen };
    case 'Cyclopentane':
      return { backgroundColor: theme.palette.custom.paleOrange };
    case 'Benzene':
      return { backgroundColor: theme.palette.custom.paleViolet };
    default:
      return { backgroundColor: theme.palette.background.default };
  }
};

export const columnsData: ColumnDataMRT[] = [
  {
    header: 'PDB ID',
    accessorKey: 'pdb_id',
    size: 60,
    Filter: () => {
      return <FilterAutocomplete allOptions={pdbOptions} filterByLabel="PDB ID" />;
    },
  },
  {
    header: 'CCD ID',
    accessorKey: 'ccd_id',
    Filter: () => {
      return <FilterAutocomplete allOptions={ccdOptions} filterByLabel="CCD ID" />;
    },
  },
  {
    header: 'RESIDUE ID',
    accessorKey: 'residue_id',
    enableColumnFilter: false,
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
  },
  {
    header: 'RING TYPE',
    accessorKey: 'ring_type',
    enableSorting: false,
    Filter: ({ column }) => {
      return (
        <FilterAutocompleteSimple
          options={['Cyclohexane', 'Cyclopentane', 'Benzene']}
          filterByLabel="ring type"
          selectedValues={column.getFilterValue() as string[]}
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
          label={ringType.charAt(0).toUpperCase() + ringType.slice(1)}
          sx={{ ...getChipStyles(ringType, theme), color: '#000', width: 123 }}
        />
      );
    },
  },
  {
    header: 'RESOLUTION [Å]',
    accessorKey: 'resolution',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
    Filter: ({ column }) => (
      <RangeSlider filterBy={column.columnDef.header} minVal={0.85} maxVal={3.04} step={0.01} />
    ),
  },
  {
    header: 'RING COVERAGE',
    accessorKey: 'ring_coverage',
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
    Filter: ({ column }) => (
      <RangeSlider filterBy={column.columnDef.header} minVal={0} maxVal={6} step={1} />
    ),
  },
  {
    header: 'CONFORMATION',
    accessorKey: 'conformation',
    enableSorting: false,

    Filter: ({ column }) => {
      return (
        <FilterAutocompleteSimple
          options={['Boat', 'Envelope', 'Chair', 'Half chair', 'Flat', 'Twist boat']}
          filterByLabel="conformation"
          selectedValues={column.getFilterValue() as string[]}
          onChange={(newSelectedValues) => {
            column.setFilterValue(newSelectedValues);
          }}
        />
      );
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
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Typography sx={{ fontSize: '0.9rem' }}>{row.original.conformation}</Typography>
          <Chip
            label={favorable ? 'favorable' : 'unfavorable'}
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
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
  },
  {
    header: 'EXPERIMENTAL METHOD',
    accessorKey: 'experimental_method',
    enableSorting: false,
    Filter: ({ column }) => {
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
            'Hybrid method',
          ]}
          filterByLabel="experimental method"
          selectedValues={column.getFilterValue() as string[]}
          onChange={(newSelectedValues) => {
            column.setFilterValue(newSelectedValues);
          }}
        />
      );
    },
    Cell: ({ cell, row }) => {
      const text = cell.getValue<string>();
      return (
        <Box
          sx={{
            whiteSpace: 'normal',
          }}
        >
          {
            <Typography
              sx={{
                // width: '120px',
                fontSize: '0.9rem',
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
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
    Filter: ({ column }) => (
      <RangeSlider filterBy={column.columnDef.header} minVal={0} maxVal={1} step={0.01} />
    ),
  },
  {
    header: 'RSCC',
    accessorKey: 'rscc',
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
    Filter: ({ column }) => (
      <RangeSlider filterBy={column.columnDef.header} minVal={0} maxVal={1} step={0.01} />
    ),
  },
  {
    header: 'LIGAND COVERAGE',
    accessorKey: 'ligand_coverage',
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
    Filter: ({ column }) => (
      <RangeSlider filterBy={column.columnDef.header} minVal={0} maxVal={100} step={0.1} />
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

      const handleContextMenu = (event: MouseEvent) => {
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
            underline="none"
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
                Ring atoms: {row.original.ring_id.split('_')[4].replaceAll('-', ' ')}
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
