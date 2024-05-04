export function generateRandomIndexInRange(max: number) {
  const indexes: number[] = [];

  while (indexes.length < max) {
    const r = Math.floor(Math.random() * max);
    if (indexes.indexOf(r) === -1) indexes.push(r);
  }

  return indexes;
}
