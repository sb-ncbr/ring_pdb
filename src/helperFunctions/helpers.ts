import ringCards from '../content/ringCards.json';
import { OtherSelectedFiltersType } from '../components/FilterAutocomplete.tsx';

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
