function toStringWithoutTrailingSlash(url: URL): string {
  return url.toString().replace(/\/$/, '');
}

export function mapHttpUrlToWs(url: URL): string {
  const copy = new URL(url);

  if (copy.protocol === 'http:') {
    copy.protocol = 'ws:';
    return toStringWithoutTrailingSlash(copy);
  }

  if (copy.protocol === 'https:') {
    copy.protocol = 'wss:';
    return toStringWithoutTrailingSlash(copy);
  }

  throw new Error(
    `Expected url to have protocol of http: or https: but was ${url.protocol}`,
  );
}

function mapHttpStringToWs(url: string): string {
  return mapHttpUrlToWs(new URL(url));
}

export function mapHttpToWs(url: URL | string): string {
  if (typeof url === 'string') {
    return mapHttpStringToWs(url);
  }

  return mapHttpUrlToWs(url);
}
