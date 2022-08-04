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

  const setIsMapOpen = (value: boolean) => {
    value ? addMapOpenQueryParameter() : deleteMapOpenQueryParameter();
  };

  const isMapOpen = queryParams[queryParameterNameMapOpen] === 'true';

  return {
    setIsMapOpen,
    isMapOpen,
  };
};
