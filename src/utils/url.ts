import { RouteComponentProps } from 'react-router-dom';

const queryParameterNameMapOpen = 'mapOpen';

export const addMapOpenQueryParameter = (
  history: RouteComponentProps['history'],
) => {
  const queryParams = new URLSearchParams(history.location.search);
  queryParams.set(queryParameterNameMapOpen, 'true');
  history.replace({
    search: queryParams.toString(),
  });
};

export const deleteMapOpenQueryParameter = (
  history: RouteComponentProps['history'],
) => {
  const queryParams = new URLSearchParams(history.location.search);
  if (queryParams.has(queryParameterNameMapOpen)) {
    queryParams.delete(queryParameterNameMapOpen);
    history.replace({
      search: queryParams.toString(),
    });
  }
};

export const isMapOpen = (queryParams: URLSearchParams) => {
  return (
    queryParams.has(queryParameterNameMapOpen) &&
    queryParams.get(queryParameterNameMapOpen) === 'true'
  );
};

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
