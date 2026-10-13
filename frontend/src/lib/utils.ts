interface StructureComponents {
  pdbId: string;
  extendedPdbId: string;
  chainId: string;
  compId: string;
  residueId: number;
  atomIds: string[];
}

export function formatNumber(value: number | null | undefined, decimals: number) {
  if (value === null || value === undefined || isNaN(value as number)) {
    return "N/A";
  }
  return (value as number).toFixed(decimals);
}


export function parseStructureString(input: string): StructureComponents {
  // Validate input
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  // Split the string by underscore
  const parts = input.split('_');

  // Validate we have the correct number of components
  const validLengths = [6, 7]; // 7 is for structures with pdb_ins code
  if (!validLengths.includes(parts.length)) {
    throw new Error('Invalid structure string format. Expected 6 or 7 underscore-separated components');
  }

  const [pdbPrefix, pdbId, chainId, compId, residueId, atomString] = parts;
  const shortPdbId = pdbId.replace(/^0+/, '');

  if (shortPdbId.length !== 4) {
    throw new Error('Not possible to convert to short pdb id.');
  }

  // Split the atoms string by hyphen
  const atomIds = atomString.split('-').filter((atom) => atom.length > 0);

  // Validate that we have at least one atom
  if (atomIds.length === 0) {
    throw new Error('At least one atom must be specified');
  }

  return {
    pdbId: shortPdbId,
    extendedPdbId: pdbPrefix + '_' + pdbId,
    chainId,
    compId,
    residueId: +residueId,
    atomIds,
  };
}
