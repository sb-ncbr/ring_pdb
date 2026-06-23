import stats from '../content/stats.json';
import { OtherSelectedFiltersType } from '../components/FilterAutocomplete.tsx';
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table';
import axios from 'axios';
import { RingType } from '../data/dataTypes.ts';

export const isFavorable = (ringName: RingType, confName: string) => {
  const ring = stats.rings.find((r) => r.name.toLowerCase() === ringName.toLowerCase());

  if (!ring) return null;
  const conf = ring.confs.find((c) => {
    return c.name === confName;
  });
  return conf ? conf.favorable : null;
};

export const getChipStyles = (type: RingType, theme: any) => {
  return {
    backgroundColor: theme.palette.custom[type.toLowerCase()] ?? theme.palette.background.default,
  };
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

  const result = {} as OtherSelectedFiltersType;

  filterKeys.forEach((key) => {
    const value = columnFilters.find((f: any) => f.id === key)?.value;

    if (key === excludeKey) {
      if (key === 'conformation') {
        result[key] = {
          selectedValues: [],
          showFavorable: true,
          showUnfavorable: true,
        };
      } else {
        result[key] = [];
      }
    } else {
      result[key] =
        value ??
        (key === 'conformation'
          ? {
              selectedValues: [],
              showFavorable: true,
              showUnfavorable: true,
            }
          : []);
    }
  });

  return result;
};

export function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatConformation(conf: string) {
  if (!conf || !/[A-Za-z]/.test(conf)) {
    return conf;
  }

  const match = conf.match(/^([0-9,]*)([A-Za-z]+)([0-9,]*)$/);

  if (!match) {
    return conf;
  }

  const [, before, letter, after] = match;

  return (
    <>
      {before && <sup>{before}</sup>}
      {letter}
      {after && <sub>{after}</sub>}
    </>
  );
}
