import {
  StopAreaMinimalShowOnMapFieldsFragment,
  useGetStopAreasByLocationQuery,
} from '../../../generated/graphql';
import {
  useAppAction,
  useAppSelector,
  useMapDataLayerSimpleQueryLoader,
} from '../../../hooks';
import {
  Operation,
  selectMapViewport,
  selectSelectedStopAreaId,
  setSelectedMapStopAreaIdAction,
} from '../../../redux';
import {
  buildWithinViewportGqlGeometryFilter,
  notNullish,
} from '../../../utils';
import { EditStopAreaLayer } from './EditStopAreaLayer';
import { MemberStops } from './MemberStops';
import { StopArea } from './StopArea';

export const StopAreas = () => {
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);

  const viewport = useAppSelector(selectMapViewport);
  const stopAreasResult = useGetStopAreasByLocationQuery({
    variables: {
      measured_location_filter: buildWithinViewportGqlGeometryFilter(viewport),
    },
    // Skip initial 0 radius fetch and wait for the map to get loaded,
    // so that we have a proper viewport.
    skip: viewport.radius <= 0,
  });

  useMapDataLayerSimpleQueryLoader(Operation.FetchStopAreas, stopAreasResult);

  const onClick = (area: StopAreaMinimalShowOnMapFieldsFragment) =>
    setSelectedMapStopAreaId(area.netex_id ?? undefined);

  const onPopupClose = () => setSelectedMapStopAreaId(undefined);

  const data = stopAreasResult.loading
    ? stopAreasResult.previousData
    : stopAreasResult.data;
  const areas = data?.stops_database?.areas?.filter(notNullish) ?? [];

  const editedArea = areas.find(
    (area) => area?.netex_id === selectedStopAreaId,
  );

  return (
    <>
      {areas.map((area) => (
        <StopArea
          area={area}
          selected={area.netex_id === editedArea?.netex_id}
          key={area.id}
          onClick={onClick}
        />
      ))}

      {editedArea ? (
        <>
          <EditStopAreaLayer
            editedArea={editedArea}
            onPopupClose={onPopupClose}
          />

          <MemberStops area={editedArea} />
        </>
      ) : null}
    </>
  );
};
