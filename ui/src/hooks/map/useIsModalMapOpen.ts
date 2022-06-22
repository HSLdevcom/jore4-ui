import { useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  resetMapEditorStateAction,
  selectIsModalMapOpen,
  setIsModalMapOpenAction,
} from '../../redux';
import { useAppDispatch, useAppSelector } from '../redux';
import { useMapUrlQuery } from '../useMapUrlQuery';

export const useIsModalMapOpen = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isModalMapOpen = useAppSelector(selectIsModalMapOpen);
  const { deleteMapOpenQueryParameter, isMapOpen } = useMapUrlQuery();

  const syncIsModalMapStateWithMapOpenQueryParam = () => {
    const mapOpen = isMapOpen();
    dispatch(setIsModalMapOpenAction(mapOpen));
  };

  useEffect(() => {
    // Syncronizes the Redux 'isModalMapOpen' state with the
    // 'mapOpen' query parameter when the page is loaded.
    syncIsModalMapStateWithMapOpenQueryParam();

    // Syncronizes the Redux 'isModalMapOpen' state with the
    // 'mapOpen' query parameter when the url changes.
    // This ensures that the map will be closed if the user
    // clicks the back button and the 'mapOpen' query parameter
    // isn't found from the url.
    return history.listen(() => {
      syncIsModalMapStateWithMapOpenQueryParam();
    });
  });

  const onCloseModalMap = () => {
    dispatch(resetMapEditorStateAction());
    dispatch(setIsModalMapOpenAction(false));
    deleteMapOpenQueryParameter();
  };

  return { isModalMapOpen, onCloseModalMap };
};
