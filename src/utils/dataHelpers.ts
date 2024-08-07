import { RowData } from "../data/dataTypes";

export function createData(
  id: number,
  ligand_name: string,
  ring_id: string,
  boat: number,
  chair: number,
  flat: number,
  half_chair: number,
  tw_boat_left: number,
  tw_boat_right: number,
  min_value: number,
  conformation: string,
  entry_id: string,
  experimental_method: string,
  release_date: number,
  resolution: number,
  coverage: number | null,
): RowData {
  return {
    id,
    ligand_name,
    ring_id,
    boat,
    chair,
    flat,
    half_chair,
    tw_boat_left,
    tw_boat_right,
    min_value,
    conformation,
    entry_id,
    experimental_method,
    release_date,
    resolution,
    coverage,
  };
}
