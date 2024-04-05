export function getRandomIndexInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getDiffrentRandomIndex(
  reference: number,
  min: number,
  max: number
) {
  const generatedIndex = Math.floor(Math.random() * (max - min + 1) + min);

  if (generatedIndex === reference) {
    getDiffrentRandomIndex(reference, min, max);
  } else {
    return generatedIndex;
  }
}
