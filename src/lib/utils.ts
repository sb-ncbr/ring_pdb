interface StructureComponents {
  pdbId: string;
  chainId: string;
  compId: string;
  residueId: number;
  atomIds: string[];
}

export function parseStructureString(input: string): StructureComponents {
  // Validate input
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  // Split the string by underscore
  const parts = input.split('_');

  // Validate we have the correct number of components
  if (parts.length !== 5) {
    throw new Error('Invalid structure string format. Expected 5 underscore-separated components');
  }

  const [pdbId, chainId, compId, residueId, atomString] = parts;

  // Split the atoms string by hyphen
  const atomIds = atomString.split('-').filter((atom) => atom.length > 0);

  // Validate that we have at least one atom
  if (atomIds.length === 0) {
    throw new Error('At least one atom must be specified');
  }

  return {
    pdbId,
    chainId,
    compId,
    residueId: +residueId,
    atomIds,
  };
}
