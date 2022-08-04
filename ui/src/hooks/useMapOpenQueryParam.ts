import { useUrlQuery } from './useUrlQuery';

export const useMapOpenQueryParam = () => {
  const queryParameterNameMapOpen = 'isMapOpen' as const;
  const { queryParams, setToUrlQuery, deleteFromUrlQuery } = useUrlQuery();

  const addMapOpenQueryParameter = () => {
    setToUrlQuery({ paramName: queryParameterNameMapOpen, value: 'true' });
  };

  const deleteMapOpenQueryParameter = () => {
    deleteFromUrlQuery({ paramName: queryParameterNameMapOpen });
  };

  const setIsMapOpen = (value: boolean) => {
    value ? addMapOpenQueryParameter() : deleteMapOpenQueryParameter();
  };

  const isMapOpen = queryParams.mapOpen === 'true';

  return {
    setIsMapOpen,
    isMapOpen,
  };
};
