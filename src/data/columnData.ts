import { ColumnData, ColumnDataMRT } from "./dataTypes";

export const columnsCyclohex: ColumnDataMRT[] = [
  {
    size: 40,
    header: "Ligand name",
    accessorKey: "ligand_name",
  },
  {
    size: 70,
    header: "Ring ID",
    accessorKey: "ring_id",
  },
  {
    size: 40,
    header: "Boat",
    accessorKey: "boat",
  },
  {
    size: 40,
    header: "Chair",
    accessorKey: "chair",
  },
  {
    size: 40,
    header: "Flat",
    accessorKey: "flat",
  },
  {
    size: 80,
    header: "Half chair",
    accessorKey: "half_chair",
  },
  {
    size: 100,
    header: "Twist boat left",
    accessorKey: "tw_boat_left",
  },
  {
    size: 100,
    header: "Twist boat right",
    accessorKey: "tw_boat_right",
  },
  {
    size: 40,
    header: "Min value",
    accessorKey: "min_value",
  },
  {
    size: 100,
    header: "Conformation",
    accessorKey: "conformation",
  },
  {
    size: 40,
    header: "Entry ID",
    accessorKey: "entry_id",
  },
  {
    size: 120,
    header: "Experimental method",
    accessorKey: "experimental_method",
  },
  {
    size: 70,
    header: "Release date",
    accessorKey: "release_date",
  },
  {
    size: 60,
    header: "Resolution",
    accessorKey: "resolution",
  },
  {
    size: 60,
    header: "Coverage",
    accessorKey: "coverage",
  },
];
export const columns: ColumnData[] = [
  {
    width: 40,
    label: "Ligand name",
    dataKey: "ligand_name",
  },
  {
    width: 70,
    label: "Ring ID",
    dataKey: "ring_id",
  },
  {
    width: 40,
    label: "Boat",
    dataKey: "boat",
    numeric: true,
  },
  {
    width: 40,
    label: "Chair",
    dataKey: "chair",
    numeric: true,
  },
  {
    width: 40,
    label: "Flat",
    dataKey: "flat",
    numeric: true,
  },
  {
    width: 80,
    label: "Half chair",
    dataKey: "half_chair",
    numeric: true,
  },
  {
    width: 100,
    label: "Twist boat left",
    dataKey: "tw_boat_left",
    numeric: true,
  },
  {
    width: 100,
    label: "Twist boat right",
    dataKey: "tw_boat_right",
    numeric: true,
  },
  {
    width: 40,
    label: "Min value",
    dataKey: "min_value",
    numeric: true,
  },
  {
    width: 100,
    label: "Conformation",
    dataKey: "conformation",
  },
  {
    width: 40,
    label: "Entry ID",
    dataKey: "entry_id",
  },
  {
    width: 120,
    label: "Experimental method",
    dataKey: "experimental_method",
  },
  {
    width: 70,
    label: "Release date",
    dataKey: "release_date",
    numeric: true,
  },
  {
    width: 60,
    label: "Resolution",
    dataKey: "resolution",
    numeric: true,
    format: (value: number) => value.toFixed(2),
  },
  {
    width: 60,
    label: "Coverage",
    dataKey: "coverage",
  },
];
