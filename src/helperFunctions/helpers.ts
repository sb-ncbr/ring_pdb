import ringCards from '../content/ringCards.json';

export const isFavorable = (ringName, confName) => {
  const ring = ringCards.rings.find((r) => r.name.toLowerCase() === ringName.toLowerCase());

  if (!ring) return null;
  const conf = ring.confs.find((c) => {
    return c.name === confName;
  });
  return conf ? conf.favorable : null;
};

export const getChipStyles = (type: string, theme) => {
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

export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
