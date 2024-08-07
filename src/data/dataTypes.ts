export interface RowData {
  id: number;
  ligand_name: string;
  ring_id: string;
  boat: number;
  chair: number;
  flat: number;
  half_chair: number;
  tw_boat_left: number;
  tw_boat_right: number;
  min_value: number;
  conformation: string;
  entry_id: string;
  experimental_method: string;
  release_date: number;
  resolution: number;
  coverage: number | null;
}

export interface ColumnData {
  dataKey: keyof RowData;
  label: string;
  numeric?: boolean;
  width: number;
  format?: (value: number) => string;
}

export interface ColumnDataMRT {
  accessorKey: keyof RowData;
  header: string;
  size: number;
}

export type APIData = Readonly<Omit<RowData, "id">>;
