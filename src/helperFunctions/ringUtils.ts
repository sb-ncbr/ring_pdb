import ringCards from '../content/ringCards.json';
import { Ring, RingCards, RingConf, RingType } from '../data/dataTypes.ts';

export function getFavorabilityFlags(confs: string[], ringNames: string[]): [boolean, boolean] {
  if (!confs.length) {
  return [true, true];
}

  const ringsToLoopThrough = ringNames.length
  ? ringNames
  : ringCards.rings.map((r) => r.name);

  let hasFav = false;
  let hasUnfav = false;
  const ringMap = Object.fromEntries(ringCards.rings.map((r) => [r.name, r]));

  ringsToLoopThrough.forEach((name: string) => {
    const ring = ringMap[name];
    if (hasFav && hasUnfav) {
      return [true, true];
    }
    const confEntry = ring.confs.find((c) => confs.includes(c.name));
    if (confEntry) {
      if (confEntry.favorable) {
        hasFav = true;
      } else {
        hasUnfav = true;
      }
    }
  });
  return [hasFav, hasUnfav];
}

export function getConformationByRingType(ringCards: RingCards) {
  return ringCards.rings.reduce(
    (acc: Record<string, string[]>, ring: Ring) => {
      acc[ring.name] = ring.confs.map((conf: RingConf) => conf.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );
}

export function getOptions(ringCards: RingCards, selectedRingTypes: string[]) {
  const conformationByRingType = getConformationByRingType(ringCards);
  const ringTypes = Object.keys(conformationByRingType);
  return selectedRingTypes.length
    ? Array.from(
        new Set(
          selectedRingTypes.flatMap((rt) =>
            ringTypes.includes(rt) ? conformationByRingType[rt as RingType] : [],
          ),
        ),
      )
    : Array.from(new Set(Object.values(conformationByRingType).flat()));
}
