let lastRandom: number;
/**
 * Generates a new pseudorandom number. Used instead of Math.random() because this one is
 * deterministic (generates the same random numbers with every run)
 * @returns random number between 0.0000... - 0.9999...
 */
export const pseudoRandom = () => {
  const newRandom = lastRandom * 31 || 0.123;
  lastRandom = newRandom - Math.floor(newRandom);
  return lastRandom;
};

/**
 * Generates a pseudorandom integer within the given interval.
 * @returns random integer between [min, max], both ends are inclusive
 */
export const randomInt = (min: number, max: number) =>
  Math.floor(pseudoRandom() * (max + 1 - min) + min);
