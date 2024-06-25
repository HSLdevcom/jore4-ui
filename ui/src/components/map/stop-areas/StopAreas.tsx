import { useEffect } from 'react';
import {
  StopAreaMinimalShowOnMapFieldsFragment,
  useGetStopAreasByLocationQuery,
} from '../../../generated/graphql';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
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
import { StopArea } from './StopArea';

export const StopAreas = () => {
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);

  const { setIsLoading } = useLoader(Operation.FetchStopAreas);

  const viewport = useAppSelector(selectMapViewport);
  const stopAreasResult = useGetStopAreasByLocationQuery({
    variables: {
      measured_location_filter: buildWithinViewportGqlGeometryFilter(viewport),
    },
  });

  useEffect(() => {
    /**
     * Here we sync getStopAreasByLocationQuery query loading state with useLoader hook state.
     *
     * We could also use useLoader's immediatelyOn option instead of useEffect,
     * but using options to dynamically control loading state feels semantically wrong.
     */
    setIsLoading(stopAreasResult.loading);
  }, [setIsLoading, stopAreasResult.loading]);

  const onClick = (area: StopAreaMinimalShowOnMapFieldsFragment) =>
    setSelectedMapStopAreaId(area.netex_id ?? undefined);

  const onPopupClose = () => setSelectedMapStopAreaId(undefined);

  const areas =
    stopAreasResult.data?.stops_database?.areas?.filter(notNullish) ?? [];

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
        </>
      ) : null}
    </>
  );
};
