import { ColumnData, ColumnDataMRT } from "./dataTypes";

export const columnsCyclohex: ColumnDataMRT[] = [
  {
    size: 40,
    header: "PDB ID",
    accessorKey: "pdb_id",
  },
  {
    size: 70,
    header: "CCD ID",
    accessorKey: "ccd_id",
  },
  {
    size: 40,
    header: "RESIDUE ID",
    accessorKey: "residue_id",
  },
  {
    size: 40,
    header: "RING TYPE",
    accessorKey: "ring_type",
  },
  {
    size: 60,
    header: "RESOLUTION [Å]",
    accessorKey: "resolution",
  },
  {
    size: 40,
    header: "RING COVERAGE",
    accessorKey: "ring_coverage",
  },
  {
    size: 100,
    header: "CONFORMATION",
    accessorKey: "conformation",
  },
  {
    size: 40,
    header: "RMSD [Å]",
    accessorKey: "rmsd",
  },
  {
    size: 120,
    header: "EXP. METHOD",
    accessorKey: "experimental_method",
    enableSorting: false,
  },
  {
    size: 70,
    header: "RSR",
    accessorKey: "rsr",
  },
  {
    size: 60,
    header: "RSCC",
    accessorKey: "rscc",
  },
  {
    size: 60,
    header: "LIGAND COVERAGE",
    accessorKey: "ligand_coverage",
  },
  {
    size: 60,
    header: "DETAILS",
    accessorKey: "details",
  },
];
