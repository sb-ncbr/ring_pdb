export interface RowData {
  id: number;
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
  details: string;
}

export interface ColumnDataMRT {
  accessorKey: keyof RowData;
  header: string;
  size: number;
  enableSorting?: boolean;
}

export type APIData = Readonly<Omit<RowData, 'id'>>;
