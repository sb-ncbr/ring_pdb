export function generateUniqueOptions(count: number, type: 'ccd' | 'pdb'): string[] {
  const pdbIds: Set<string> = new Set();

  while (pdbIds.size < count) {
    const pdbId = generateOptions(type);
    pdbIds.add(pdbId);
  }

  return Array.from(pdbIds);
}

export function generateOptions(type: 'ccd' | 'pdb'): string {
  let characters;
  let length = 0;
  let result = '';

  if (type === 'ccd') {
    characters = 'KLMNOP6789';
    length = 3;
  } else if (type === 'pdb') {
    characters = 'abcdef12345';
    length = 4;
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
