import { useSetToUrlQuery } from './useSetToUrlQuery';

export const useSetObservationDateToUrl = () => {
  const setToUrlQuery = useSetToUrlQuery();

  /** Sets observationDate to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setObservationDateToUrl = (date: string, replace = false) => {
    setToUrlQuery({ paramName: 'observationDate', value: date, replace });
  };

  return setObservationDateToUrl;
};
