import { FC, useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import { navigationBlockerContext } from '../forms/common/NavigationBlocker';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';
import { RouteEditorRef } from './refTypes';

const testIds = { mapPage: 'mapPage' };

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 64;
const mapFooterHeight = 82;

export const MapPage: FC = () => {
  const mapRef = useRef<RouteEditorRef>(null);
  const navigate = useNavigate();
  const { requestNavigation } = useContext(navigationBlockerContext);

  const onCloseMap = () => {
    requestNavigation(() => {
      // Navigate back to the previous page
      navigate(-1);
    });
  };

  return (
    <div
      data-testid={testIds.mapPage}
      className="absolute inset-0 z-30 overflow-hidden bg-background"
    >
      <MapHeader onClose={onCloseMap} />

      <Map
        height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
        width="100%"
        ref={mapRef}
      />

      <MapFooter
        onDrawRoute={() => mapRef.current?.onDrawRoute()}
        onEditRoute={() => mapRef.current?.onEditRoute()}
        onDeleteRoute={() => mapRef.current?.onDeleteRoute()}
        onCancel={() => mapRef.current?.onCancel()}
        onSave={() => mapRef.current?.onSave()}
      />
    </div>
  );
};
