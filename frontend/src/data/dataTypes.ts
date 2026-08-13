import { MRT_Cell, MRT_Row } from 'material-react-table';

export interface RowData {
  ring_id: string;
  extended_PDB_ID: string;
  pdb_id: string;
  ccd_id: string;
  residue_id: number;
  ring_type: string;
  resolution: number;
  ring_coverage: number;
  conformation: string;
  conf_main_type: string;
  experimental_method: string;
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
export type RingType = 'Cyclohexane' | 'Benzene' | 'Cyclopentane' | 'Oxane' | 'Oxolane';

export type HomocycleType = Extract<RingType, 'Benzene' | 'Cyclohexane' | 'Cyclopentane'>;

export interface RingConf {
  name: string;
  count: number;
  favorable: boolean;
  type?: string;
  label?: string;
}

export interface Ring {
  name: RingType;
  ccd: number;
  pdb: number;
  total: number;
  confs: RingConf[];
}

export interface RingCards {
  rings: Ring[];
}
