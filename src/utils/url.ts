export const mapHttpToWs = (origin: string) => {
  if (origin.startsWith('http://')) {
    return origin.replace('http://', 'ws://');
  }
  if (origin.startsWith('https://')) {
    return origin.replace('https://', 'wss://');
  }
  // eslint-disable-next-line no-console
  console.error(
    `Expected string to start with "http://" or "https://" but got ${origin}`,
  );
  return origin;
};
