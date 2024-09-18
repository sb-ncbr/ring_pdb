import Link from '@mui/material/Link';
import { ColumnDataMRT } from './dataTypes';

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
  },
  {
    header: 'RING TYPE',
    accessorKey: 'ring_type',
    enableSorting: false,
  },
  {
    header: 'RESOLUTION [Å]',
    accessorKey: 'resolution',
  },
  {
    header: 'RING COVERAGE',
    accessorKey: 'ring_coverage',
  },
  {
    header: 'CONFORMATION',
    accessorKey: 'conformation',
    enableSorting: false,
  },
  {
    header: 'RMSD [Å]',
    accessorKey: 'rmsd',
  },
  {
    header: 'EXP. METHOD',
    accessorKey: 'experimental_method',
    enableSorting: false,
  },
  {
    header: 'RSR',
    accessorKey: 'rsr',
  },
  {
    header: 'RSCC',
    accessorKey: 'rscc',
  },
  {
    header: 'LIGAND COVERAGE',
    accessorKey: 'ligand_coverage',
  },
  {
    header: 'DETAILS',
    accessorKey: 'details',
    enableSorting: false,
    Cell: ({ cell, row }) => (
      <Link
        href={`result/example-1`}
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
    ),
  },
];
