import { ColumnFilter } from '@tanstack/react-table';

export type FilterList = string[];

export interface GetUpdatedFiltersParams {
  newFilters: ColumnFilter[];
  columnFilters: ColumnFilter[];
  level1Filters: FilterList;
  level2Filters: FilterList;
  level3Filters: FilterList;
}

export interface GetUpdatedFiltersResult {
  filters: ColumnFilter[];
  resetLevel: string | null;
}

export type FilterKey = 'resolution' | 'ring_coverage';

export const level1Filters = ['ring_type', 'conformation'];
export const level2Filters = ['extended_PDB_ID', 'ccd_id', 'experimental_method'];
export const level3Filters = ['resolution', 'ring_coverage'];

export const sliderFilterKeys = ['resolution', 'ring_coverage'];
export const combinedFilters = new Map(
  [...level1Filters, ...level2Filters, ...level3Filters].map((id) => [id, { id, value: [] }]),
);



export const getUpdatedFilters = ({
  newFilters,
  columnFilters,
  level1Filters,
  level2Filters,
  level3Filters,
}: GetUpdatedFiltersParams): GetUpdatedFiltersResult => {
  const changedFilterIds = newFilters
    .filter(
      (nf: ColumnFilter) =>
        !columnFilters.some(
          (oldFilters) =>
            oldFilters.id === nf.id &&
            JSON.stringify(oldFilters.value) === JSON.stringify(nf.value),
        ),
    )
    .map((f: ColumnFilter) => f.id);

  if (changedFilterIds.some((id) => level1Filters.includes(id))) {
    return {
      filters: newFilters.filter(
        (f: ColumnFilter) => !level2Filters.includes(f.id) && !level3Filters.includes(f.id),
      ),
      resetLevel: 'level1',
    };
  }

  if (changedFilterIds.some((id) => level2Filters.includes(id))) {
    return {
      filters: newFilters.filter((f: ColumnFilter) => !level3Filters.includes(f.id)),
      resetLevel: 'level2',
    };
  }

  return {
    filters: newFilters,
    resetLevel: null,
  };
};
