import { useHistory } from 'react-router';

export const useMapUrlQuery = () => {
  const history = useHistory();
  const queryParameterNameMapOpen = 'mapOpen' as const;

  const addMapOpenQueryParameter = () => {
    const queryParams = new URLSearchParams(history.location.search);
    queryParams.set(queryParameterNameMapOpen, 'true');
    history.replace({
      search: queryParams.toString(),
    });
  };

  const deleteMapOpenQueryParameter = () => {
    const queryParams = new URLSearchParams(history.location.search);
    if (queryParams.has(queryParameterNameMapOpen)) {
      queryParams.delete(queryParameterNameMapOpen);
      history.replace({
        search: queryParams.toString(),
      });
    }
  };

  const isMapOpen = () => {
    const queryParams = new URLSearchParams(history.location.search);
    return (
      queryParams.has(queryParameterNameMapOpen) &&
      queryParams.get(queryParameterNameMapOpen) === 'true'
    );
  };

  return {
    addMapOpenQueryParameter,
    deleteMapOpenQueryParameter,
    isMapOpen,
  };
};
