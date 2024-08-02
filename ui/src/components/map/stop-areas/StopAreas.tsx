import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  StopAreaMinimalShowOnMapFieldsFragment,
  useGetStopAreaByIdAsyncQuery,
  useGetStopAreasByLocationQuery,
} from '../../../generated/graphql';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  Operation,
  selectEditedStopAreaData,
  selectMapViewport,
  selectSelectedStopAreaId,
  setEditedStopAreaDataAction,
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
  const dispatch = useDispatch();
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);

  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);

  const { setIsLoading } = useLoader(Operation.FetchStopAreas);

  const viewport = useAppSelector(selectMapViewport);
  const stopAreasResult = useGetStopAreasByLocationQuery({
    variables: {
      measured_location_filter: buildWithinViewportGqlGeometryFilter(viewport),
    },
  });

  const [getStopAreaById] = useGetStopAreaByIdAsyncQuery();

  const fetchStopArea = useCallback(async () => {
    if (selectedStopAreaId) {
      const stopAreaResult = await getStopAreaById({
        stopAreaId: selectedStopAreaId,
      });
      const stopArea =
        stopAreaResult.data?.stop_registry?.groupOfStopPlaces?.[0] ?? undefined;
      dispatch(setEditedStopAreaDataAction(stopArea));
    } else {
      dispatch(setEditedStopAreaDataAction(undefined));
    }
  }, [getStopAreaById, selectedStopAreaId, dispatch]);

  useEffect(() => {
    fetchStopArea();
  }, [selectedStopAreaId, fetchStopArea]);

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

  const data = stopAreasResult.loading
    ? stopAreasResult.previousData
    : stopAreasResult.data;
  const areas = data?.stops_database?.areas?.filter(notNullish) ?? [];

  return (
    <>
      {areas.map((area) => (
        <StopArea
          area={area}
          selected={area.netex_id === selectedStopAreaId}
          key={area.id}
          onClick={onClick}
        />
      ))}

      {editedStopAreaData ? (
        <>
          <EditStopAreaLayer
            editedArea={editedStopAreaData}
            onPopupClose={onPopupClose}
          />

          <MemberStops area={editedStopAreaData} />
        </>
      ) : null}
    </>
  );
};
