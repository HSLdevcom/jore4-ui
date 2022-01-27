import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../../context/MapEditorContext';
import { ModalMapContext } from '../../context/ModalMapContext';
import {
  InsertRouteOneMutationVariables,
  RouteDirectionEnum,
  useInsertRouteOneMutation,
} from '../../generated/graphql';
import { mapInfraLinksAlongRouteToGraphQL } from '../../graphql/infrastructureNetwork';
import { Modal } from '../../uiComponents';
import { mapToObject, mapToVariables, showToast } from '../../utils';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';

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
  const { t } = useTranslation();
  const { state: mapEditorState, dispatch: mapEditorDispatch } =
    useContext(MapEditorContext);
  const { state: modalMapState, dispatch: modalMapDispatch } =
    useContext(ModalMapContext);

  const [insertRouteMutation] = useInsertRouteOneMutation();

  const onAddStop = () => mapEditorDispatch({ type: 'toggleAddStop' });
  const onDrawRoute = () => mapEditorDispatch({ type: 'toggleDrawRoute' });
  const onEditRoute = () => mapEditorDispatch({ type: 'toggleEditRoute' });
  const onCancel = () => {
    mapRef?.current?.onDeleteDrawnRoute();
    mapEditorDispatch({ type: 'reset' });
  };
  const onSave = async () => {
    const { busRoute, stopIdsWithinRoute, infraLinksAlongRoute } =
      mapEditorState;

    if (
      busRoute &&
      infraLinksAlongRoute &&
      stopIdsWithinRoute &&
      stopIdsWithinRoute.length >= 2
    ) {
      // TODO: user should be able to select starting stop and final stop from some kind of UI.
      // TODO: for now, just use the first and last stops found.
      const startingStopId = stopIdsWithinRoute[0];
      const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

      const variables: InsertRouteOneMutationVariables = mapToObject({
        starts_from_scheduled_stop_point_id: startingStopId,
        ends_at_scheduled_stop_point_id: finalStopId,
        on_line_id: mapEditorState.routeDetails?.on_line_id,
        label: mapEditorState.routeDetails?.label,
        description_i18n: mapEditorState.routeDetails?.description_i18n,
        direction: RouteDirectionEnum.Outbound, // TODO: make this user-configurable
        priority: 10,
        // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
        infrastructure_links_along_route: {
          data: mapInfraLinksAlongRouteToGraphQL(infraLinksAlongRoute),
        },
        route_journey_patterns: {
          data: {
            scheduled_stop_point_in_journey_patterns: {
              data: stopIdsWithinRoute.map((stopId, index) => ({
                scheduled_stop_point_id: stopId,
                scheduled_stop_point_sequence: index,
              })),
            },
          },
        },
      });
      try {
        await insertRouteMutation(mapToVariables(variables));
        showToast({ type: 'success', message: t('routes.saveSuccess') });
      } catch (err) {
        showToast({
          type: 'danger',
          message: `${t('errors.saveFailed')}, ${err}`,
        });
      }
    } else {
      showToast({ type: 'danger', message: t('errors.saveFailed') });
    }
  };
  const onDeleteRoute = () => {
    mapEditorDispatch({
      type: 'setState',
      payload: { drawingMode: undefined },
    });
    mapRef?.current?.onDeleteDrawnRoute();
  };
  const onCloseModalMap = () => {
    mapEditorDispatch({ type: 'reset' });
    modalMapDispatch({ type: 'close' });
  };

  const { canAddStops } = mapEditorState;

  return (
    <Modal
      isOpen={modalMapState.isOpen}
      onClose={onCloseModalMap}
      className={className}
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
        canAddStops={canAddStops}
        drawable
        ref={mapRef}
      />
      <MapFooter
        onDrawRoute={onDrawRoute}
        onEditRoute={onEditRoute}
        onDeleteRoute={onDeleteRoute}
        onCancel={onCancel}
        onSave={onSave}
        canAddStops={canAddStops}
        onAddStop={onAddStop}
      />
    </Modal>
  );
};
