export function generateRandomIndexInRange(max: number) {
  let indexes: number[] = [];

  while (indexes.length < max) {
    let r = Math.floor(Math.random() * max);
    if (indexes.indexOf(r) === -1) indexes.push(r);
  }

  return indexes;
}
