import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { ModalMapContext } from '../../context/ModalMapContext';
import {
  InsertRouteOneMutationVariables,
  RouteDirectionEnum,
  useInsertRouteOneMutation,
  useUpdateRouteGeometryMutation,
} from '../../generated/graphql';
import { mapInfraLinksAlongRouteToGraphQL } from '../../graphql';
import { Modal } from '../../uiComponents';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showToast,
} from '../../utils';
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
  const [updateRouteGeometryMutation] = useUpdateRouteGeometryMutation();

  const { drawingMode } = mapEditorState;

  const onAddStop = () => mapEditorDispatch({ type: 'toggleAddStop' });
  const onDrawRoute = () => {
    mapRef?.current?.onDeleteDrawnRoute();
    mapEditorDispatch({
      type: drawingMode === Mode.Draw ? 'stopDrawRoute' : 'startDrawRoute',
    });
  };
  const onEditRoute = () => {
    if (!mapEditorState.creatingNewRoute) {
      mapRef?.current?.onDeleteDrawnRoute();
    }
    mapEditorDispatch({
      type: drawingMode === Mode.Edit ? 'stopEditRoute' : 'startEditRoute',
    });
  };
  const onCancel = () => {
    mapRef?.current?.onDeleteDrawnRoute();

    mapEditorDispatch({ type: 'stopDrawRoute' });
    mapEditorDispatch({ type: 'stopEditRoute' });
  };
  const onSave = async () => {
    const {
      busRoute,
      stopIdsWithinRoute,
      infraLinksAlongRoute,
      editingRouteId,
    } = mapEditorState;

    if (editingRouteId === undefined) {
      return;
    }

    if (
      busRoute &&
      infraLinksAlongRoute?.has(editingRouteId) &&
      stopIdsWithinRoute &&
      stopIdsWithinRoute.length >= 2
    ) {
      // TODO: user should be able to select starting stop and final stop from some kind of UI.
      // TODO: for now, just use the first and last stops found.
      const startingStopId = stopIdsWithinRoute[0];
      const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

      const { routeDetails: routeDetailsMap } = mapEditorState;

      if (!routeDetailsMap?.has(editingRouteId)) {
        // eslint-disable-next-line no-console
        console.error('Something went wrong');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const routeDetails = routeDetailsMap.get(editingRouteId)!;

      const currentRouteInfrastructureLinks =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        infraLinksAlongRoute.get(editingRouteId)!;

      const variables: InsertRouteOneMutationVariables = mapToObject({
        starts_from_scheduled_stop_point_id: startingStopId,
        ends_at_scheduled_stop_point_id: finalStopId,
        on_line_id: routeDetails.on_line_id,
        label: routeDetails.label,
        description_i18n: routeDetails.description_i18n,
        direction: RouteDirectionEnum.Outbound, // TODO: make this user-configurable
        priority: routeDetails.priority,
        validity_start: mapDateInputToValidityStart(
          // form validation makes sure that 'validityStart' has a valid value at this poin
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          routeDetails.validityStart!,
        ),
        validity_end: mapDateInputToValidityEnd(
          routeDetails.validityEnd,
          routeDetails.indefinite,
        ),
        // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
        infrastructure_links_along_route: {
          data: mapInfraLinksAlongRouteToGraphQL(
            currentRouteInfrastructureLinks,
          ),
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
      if (editingRouteId) {
        try {
          await updateRouteGeometryMutation(
            mapToVariables({
              route_id: editingRouteId,
              new_infrastructure_links:
                variables.object.infrastructure_links_along_route?.data.map(
                  (link) => ({ ...link, route_id: editingRouteId }),
                ),
              new_journey_pattern: {
                on_route_id: editingRouteId,
                ...variables.object.route_journey_patterns?.data,
              },
              route_route: {
                starts_from_scheduled_stop_point_id: startingStopId,
                ends_at_scheduled_stop_point_id: finalStopId,
              },
            }),
          );
          showToast({ type: 'success', message: t('routes.saveSuccess') });
        } catch (err) {
          showToast({
            type: 'danger',
            message: `${t('errors.saveFailed')}, ${err}`,
          });
        }
      } else {
        try {
          await insertRouteMutation(mapToVariables(variables));
          showToast({ type: 'success', message: t('routes.saveSuccess') });
        } catch (err) {
          showToast({
            type: 'danger',
            message: `${t('errors.saveFailed')}, ${err}`,
          });
        }
      }
    } else {
      showToast({ type: 'danger', message: t('errors.saveFailed') });
    }
  };
  const onDeleteRoute = () => {
    onCancel();
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
