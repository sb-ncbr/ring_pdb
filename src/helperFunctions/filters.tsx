import { Box } from '@mui/material';
import { MRT_TableHeadCellFilterContainer } from 'material-react-table';

export type FilterKey = 'resolution' | 'ring_coverage' | 'ligand_coverage' | 'rsr' | 'rscc';
export const columnDefaultState = {
  experimental_method: true,
  rsr: true,
  rscc: true,
  ligand_coverage: false,
};
export const defaultFilterKeys = ['ring_type', 'conformation'];
export const advancedFilterKeys = [
  'pdb_id',
  'ccd_id',
  'experimental_method',
  'resolution',
  'ring_coverage',
  'ligand_coverage',
  'rsr',
  'rscc',
];
export const sliderFilterKeys = ['resolution', 'ring_coverage', 'ligand_coverage', 'rsr', 'rscc'];
export const combinedFilters = new Map(advancedFilterKeys.map((id) => [id, { id, value: [] }]));
