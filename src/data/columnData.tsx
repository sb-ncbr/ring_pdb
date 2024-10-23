import { ColumnDataMRT } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import RangeSlider from '../components/RangeSlider.tsx';
import FilterAutocomplete from '../components/FilterAutocomplete.tsx';
import { generateUniqueOptions } from './testGeneratedData.ts';
import { FilterAutocompleteSimple } from '../components/FilterAutocompleteSimple.tsx';

const formatString = (str, splitBy) => {
  const substring = str.split(',');
  if (substring.length > 1) {
    return formatString(substring[0], splitBy) + ', ' + formatString(substring[1].trim(), splitBy);
  }
  const words = str.split(splitBy);
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const remainingWords = words.slice(1).join(' ').toLowerCase();

  return `${firstWord} ${remainingWords}`.trim();
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
    Filter: () => {
      return (
        <FilterAutocompleteSimple
          options={['Cyclohexane', 'Cyclopentane', 'Benzene']}
          filterByLabel="ring type"
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

    Filter: () => {
      return (
        <FilterAutocompleteSimple
          options={['Boat', 'Envelope', 'Chair', 'Half chair', 'Flat', 'Twist boat']}
          filterByLabel="conformation"
        />
      );
    },
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
          <Typography sx={{ fontSize: '0.9rem' }}>
            {formatString(cell.getValue<string>(), '_')}
          </Typography>
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
    Filter: () => {
      return (
        <FilterAutocompleteSimple
          options={['X-ray diffraction', 'Hybrid method']}
          filterByLabel="experimental method"
        />
      );
    },
    Cell: ({ cell, row }) => {
      // const text = formatString(cell.getValue<string>(), ' ');
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
      // console.log(row.original);
      return (
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
