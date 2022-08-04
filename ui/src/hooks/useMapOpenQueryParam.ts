import { useUrlQuery } from './useUrlQuery';

export const useMapOpenQueryParam = () => {
  const queryParameterNameMapOpen = 'mapOpen' as const;
  const {
    getBooleanParamFromUrlQuery,
    setBooleanToUrlQuery,
    deleteFromUrlQuery,
  } = useUrlQuery();

  const addMapOpenQueryParameter = () => {
    setBooleanToUrlQuery({ paramName: queryParameterNameMapOpen, value: true });
  };

  const deleteMapOpenQueryParameter = () => {
    deleteFromUrlQuery({ paramName: queryParameterNameMapOpen });
  };

  const isMapOpen = getBooleanParamFromUrlQuery(queryParameterNameMapOpen);

  return {
    addMapOpenQueryParameter,
    deleteMapOpenQueryParameter,
    isMapOpen,
  };
};
