import { ColumnDataMRT } from './dataTypes';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';
import { Link } from 'react-router-dom';

export const columnsData: ColumnDataMRT[] = [
  {
    header: 'PDB ID',
    accessorKey: 'pdb_id',
  },
  {
    header: 'CCD ID',
    accessorKey: 'ccd_id',
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
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
  },
  {
    header: 'RING COVERAGE',
    accessorKey: 'ring_coverage',
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
  },
  {
    header: 'CONFORMATION',
    accessorKey: 'conformation',
    enableSorting: false,
    filterVariant: 'multi-select',
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
  },
  {
    header: 'RSCC',
    accessorKey: 'rscc',
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
  },
  {
    header: 'LIGAND COVERAGE',
    accessorKey: 'ligand_coverage',
    filterVariant: 'text',
    Cell: ({ cell }) => <Box sx={{ textAlign: 'right' }}>{cell.getValue<number>()}</Box>,
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
