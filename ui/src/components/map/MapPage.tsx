import { FC, useRef } from 'react';
import { useNavigateBackSafely } from '../../hooks';
import { useWrapInContextNavigation } from '../forms/common/NavigationBlocker';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';
import { MapLoader } from './MapLoader';
import { RouteEditorRef } from './refTypes';
import { ProvideMapUrlStateContext } from './utils/mapUrlState';

const testIds = { mapPage: 'mapPage' };

export const MapPage: FC = () => {
  const mapRef = useRef<RouteEditorRef>(null);
  const navigateBackSafely = useNavigateBackSafely();
  const wrapInContextNavigation = useWrapInContextNavigation('MapPage');

  const onCloseMap = wrapInContextNavigation(() => {
    navigateBackSafely('/');
  });

  return (
    <ProvideMapUrlStateContext>
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
    </ProvideMapUrlStateContext>
  );
};
