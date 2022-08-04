import { useUrlQuery } from './useUrlQuery';

export const useMapOpenQueryParam = () => {
  const queryParameterNameMapOpen = 'mapOpen' as const;
  const { queryParams, setToUrlQuery, deleteFromUrlQuery } = useUrlQuery();

  const addMapOpenQueryParameter = () => {
    setToUrlQuery({ paramName: queryParameterNameMapOpen, value: 'true' });
  };

  const deleteMapOpenQueryParameter = () => {
    deleteFromUrlQuery({ paramName: queryParameterNameMapOpen });
  };

  const isMapOpen = queryParams.mapOpen === 'true';

  return {
    addMapOpenQueryParameter,
    deleteMapOpenQueryParameter,
    isMapOpen,
  };
};
