import { useContext } from 'react';
import { MapFilterContext } from '../context/MapFilterContext';

export const useObservationDate = () => {
  const {
    state: { observationDate },
    dispatch,
  } = useContext(MapFilterContext);

  const setObservationDate = (dateString: string) => {
    dispatch({ type: 'setState', payload: { observationDate: dateString } });
  };

  return { observationDate, setObservationDate };
};
