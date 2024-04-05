export function generateRandomIndexInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateDiffrentRandomIndex(
  reference: number,
  min: number,
  max: number
) {
  let generatedIndex = generateRandomIndexInRange(min, max);

  // if (generatedIndex === reference) {
  //   generateDiffrentRandomIndex(reference, min, max);
  // } else {
  //   return generatedIndex;
  // }
  while (generatedIndex === reference) {
    generatedIndex = generateRandomIndexInRange(min, max);
  }

  return generatedIndex;
}
