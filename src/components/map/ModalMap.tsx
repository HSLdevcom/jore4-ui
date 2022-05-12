import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector, useMapUrlQuery } from '../../hooks';
import {
  resetMapEditorStateAction,
  selectIsModalMapOpen,
  setIsModalMapOpenAction,
} from '../../redux';
import { Modal } from '../../uiComponents';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';
import { RouteEditor } from './routes/RouteEditor';

interface Props {
  className?: string;
}

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 64;
const mapFooterHeight = 82;

export const ModalMap: React.FC<Props> = ({ className }) => {
  const mapRef = useRef<ExplicitAny>(null);
  const routeEditorRef = useRef<ExplicitAny>(null);

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

  return (
    <Modal
      isOpen={isModalMapOpen}
      onClose={onCloseModalMap}
      className={`absolute left-0 top-0 z-10 h-full w-full !bg-background ${
        className || ''
      }`}
    >
      <MapHeader onClose={onCloseModalMap} />
      {/* Setting height of map component dynamically seems to be tricky as
          it doesn't respect e.g. "height: 100%" rule.
          As a workaround we can use css's `calc` function and magically subtract
          height of MapHeader and MapFooterfrom full screen height.
          This is ugly, but seems to work perfectly - at least until someone changes
          height of header/footer...
        */}
      <Map
        height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
        drawable
        ref={mapRef}
      />
      <MapFooter
        onDrawRoute={() => routeEditorRef.current.onDrawRoute()}
        onEditRoute={() => routeEditorRef.current.onEditRoute()}
        onDeleteRoute={() => routeEditorRef.current.onDeleteRoute()}
        onCancel={() => routeEditorRef.current.onCancel()}
        onSave={() => routeEditorRef.current.onSave()}
      />
      <RouteEditor
        onDeleteDrawnRoute={() => mapRef.current.onDeleteDrawnRoute()}
        ref={routeEditorRef}
      />
    </Modal>
  );
};
