import { FC, useRef } from 'react';
import { useNavigateBackSafely } from '../../hooks';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';
import { MapLoader } from './MapLoader';
import { RouteEditorRef } from './refTypes';

const testIds = { mapPage: 'mapPage' };

export const MapPage: FC = () => {
  const mapRef = useRef<RouteEditorRef>(null);
  const navigateBackSafely = useNavigateBackSafely();

  const onCloseMap = () => {
    navigateBackSafely('/');
  };

  return (
    <div
      data-testid={testIds.mapPage}
      className="flex h-screen w-screen flex-col bg-background"
    >
      <MapHeader onClose={onCloseMap} />

      <Map ref={mapRef} className="flex-grow" />

      <MapFooter
        onDrawRoute={() => mapRef.current?.onDrawRoute()}
        onEditRoute={() => mapRef.current?.onEditRoute()}
        onDeleteRoute={() => mapRef.current?.onDeleteRoute()}
        onCancel={() => mapRef.current?.onCancel()}
        onSave={() => mapRef.current?.onSave()}
      />
      <MapLoader />
    </div>
  );
};
