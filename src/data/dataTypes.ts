import { MRT_Cell, MRT_Row } from 'material-react-table';

export interface RowData {
  pdb_id: string;
  ccd_id: string;
  residue_id: number;
  ring_type: string;
  resolution: number;
  ring_coverage: number;
  conformation: string;
  rmsd: number;
  experimental_method: string;
  rsr: number;
  rscc: number;
  ligand_coverage: string;
  img_url: string;
}

export interface ColumnDataMRT {
  accessorKey: keyof RowData;
  header: string;
  size?: number;
  maxSize?: number;
  minSize?: number;
  enableSorting?: boolean;
  Cell?: ({ cell, row }: { cell: MRT_Cell<RowData>; row: MRT_Row<RowData> }) => any;
  muiTableHeadCellProps?: any;
  filterVariant?: string;
  enableColumnFilter?: boolean;
  Filter?: any;
  filterSelectOptions?: any;
  filterFn?: any;
  columnFilterModeOptions?: any;
}

export type APIData = Readonly<Omit<RowData, 'id'>>;
