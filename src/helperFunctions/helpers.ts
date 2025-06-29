import ringCards from '../content/ringCards.json';
import { OtherSelectedFiltersType } from '../components/FilterAutocomplete.tsx';
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table';
import axios from 'axios';

export const isFavorable = (ringName: string, confName: string) => {
  const ring = ringCards.rings.find((r) => r.name.toLowerCase() === ringName.toLowerCase());

  if (!ring) return null;
  const conf = ring.confs.find((c) => {
    return c.name === confName;
  });
  return conf ? conf.favorable : null;
};

export const getChipStyles = (type: string, theme: any) => {
  switch (type) {
    case 'Cyclohexane':
      return { backgroundColor: theme.palette.custom.paleGreen };
    case 'Cyclopentane':
      return { backgroundColor: theme.palette.custom.paleOrange };
    case 'Benzene':
      return { backgroundColor: theme.palette.custom.paleViolet };
    default:
      return { backgroundColor: theme.palette.background.default };
  }
};

export const getOtherSelectedFilters = (
  columnFilters: any[],
  excludeKey: keyof OtherSelectedFiltersType,
): OtherSelectedFiltersType => {
  const filterKeys: (keyof OtherSelectedFiltersType)[] = [
    'ring_type',
    'conformation',
    'ccd_id',
    'pdb_id',
    'experimental_method',
  ];

  return filterKeys.reduce((acc, key) => {
    const value = columnFilters.find((f: any) => f.id === key)?.value;
    acc[key] = key === 'conformation' && value?.selectedValues ? value.selectedValues : value;
    if (key === excludeKey) {
      acc[key] = [];
    }
    return acc;
  }, {} as OtherSelectedFiltersType);
};

export function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const exportAllData = async (filters: MRT_ColumnFiltersState, sorting: MRT_SortingState) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/export-data`,
      { filters, sorting },
      { responseType: 'blob' },
    );

    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
