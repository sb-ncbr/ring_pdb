import { ColumnDataMRT } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import RangeSlider from '../components/RangeSlider.tsx';
import FilterAutocomplete from '../components/FilterAutocomplete.tsx';

const formatString = (str) => {
  const words = str.split('_');
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const remainingWords = words.slice(1).join(' ').toLowerCase();

  return `${firstWord} ${remainingWords}`.trim();
};

export const columnsData: ColumnDataMRT[] = [
  {
    header: 'PDB ID',
    accessorKey: 'pdb_id',
    Filter: () => {
      return <FilterAutocomplete />;
    },
  },
  {
    header: 'CCD ID',
    accessorKey: 'ccd_id',
    filterVariant: 'multi-select',
  },
  {
    header: 'RESIDUE ID',
    accessorKey: 'residue_id',
    size: 90,
    enableColumnFilter: false,
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
  },
  {
    header: 'RING TYPE',
    accessorKey: 'ring_type',
    enableSorting: false,
    filterVariant: 'multi-select',
    muiTableHeadCellFilterTextFieldProps: {
      placeholder: 'Ring type',
    },
    Cell: ({ cell }) => {
      const ringType = cell.getValue<string>();
      const theme = useTheme();
      const getChipStyles = (type: string) => {
        switch (type) {
          case 'cyclohexane':
            return { backgroundColor: theme.palette.custom.paleGreen, color: '#000' };
          case 'cyclopentane':
            return { backgroundColor: theme.palette.custom.paleOrange, color: '#000' };
          case 'benzene':
            return { backgroundColor: theme.palette.custom.paleViolet, color: '#000' };
          default:
            return { backgroundColor: theme.palette.background.default, color: '#000' };
        }
      };

      return <Chip label={ringType} sx={{ ...getChipStyles(ringType), width: 123 }} />;
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
    filterVariant: 'multi-select',
    Cell: ({ cell }) => {
      const favorable = cell.getValue<string>() !== 'HALF_CHAIR'; // tmp value
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
          <Typography>{formatString(cell.getValue<string>())}</Typography>
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
    header: 'EXP. METHOD',
    accessorKey: 'experimental_method',
    enableSorting: false,
    filterSelectOptions: ['X-ray diffraction', 'Hybrid'],
    filterVariant: 'multi-select',
    Cell: ({ cell, row }) => (
      <Box
        sx={{
          whiteSpace: 'normal',
        }}
      >
        {cell.getValue()}
      </Box>
    ),
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
    accessorKey: 'details',
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ cell, row }) => {
      return (
        <Link
          to={`/ring-details/${row.original.pdb_id}`}
          state={{ rowData: row.original }}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={cell.getValue<string>()}
            alt={`'Vector graphics of ligand' ${row.original.ccd_id}`}
            style={{ maxHeight: 50, margin: -10 }}
          />
        </Link>
      );
    },
  },
];
