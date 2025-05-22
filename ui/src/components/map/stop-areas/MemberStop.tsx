import { Marker } from 'react-map-gl/maplibre';
import { QuayDetailsFragment } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  selectMapStopViewState,
  selectSelectedStopId,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { getGeometryPoint } from '../../../utils';
import { Circle } from '../markers';

const testIds = {
  memberStop: ({ id }: QuayDetailsFragment) =>
    `Map::StopArea::memberStop::${id}`,
};

type MemberStopProps = {
  readonly stop: QuayDetailsFragment;
};

export const MemberStop = ({ stop }: MemberStopProps) => {
  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);

  const setMapStopAreaViewState = useAppAction(setMapStopAreaViewStateAction);

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);

  const onClick = async () => {
    if (!stop.id || mapStopViewState !== MapEntityEditorViewState.NONE) {
      return;
    }

    setSelectedStopId(stop.id);
    setMapStopAreaViewState(MapEntityEditorViewState.NONE);
    setMapStopViewState(MapEntityEditorViewState.POPUP);
  };

  const point = getGeometryPoint(stop.geometry);
  if (!point) {
    return null;
  }

  return (
    <Marker latitude={point.latitude} longitude={point.longitude}>
      <Circle
        borderColor={theme.colors.tweakedBrand}
        onClick={onClick}
        size={30}
        testId={testIds.memberStop(stop)}
        centerDot={selectedStopId === stop.id}
        centerDotSize={4.5}
      />
    </Marker>
  );
};
