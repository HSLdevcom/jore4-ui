import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl/maplibre';
import { QuayDetailsFragment } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import {
  useAppAction,
  useResolveScheduledStopPointByStopPlaceRef,
} from '../../../hooks';
import {
  setEditedStopDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { getGeometryPoint, showDangerToastWithError } from '../../../utils';
import { Circle } from '../markers';

const testIds = {
  memberStop: ({ id }: QuayDetailsFragment) =>
    `Map::StopArea::memberStop::${id}`,
};

type MemberStopProps = {
  readonly stop: QuayDetailsFragment;
};

export const MemberStop = ({ stop }: MemberStopProps) => {
  const { t } = useTranslation();

  const resolveScheduledStopPoint =
    useResolveScheduledStopPointByStopPlaceRef();
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);

  const onClick = async () => {
    if (!stop.id) {
      return;
    }

    try {
      const scheduledStopPoint = await resolveScheduledStopPoint(stop.id);
      setSelectedMapStopAreaId(undefined);
      setSelectedStopId(scheduledStopPoint.scheduled_stop_point_id);
      setEditedStopData(scheduledStopPoint);
    } catch (e) {
      showDangerToastWithError(
        t('stopArea.errors.failedToResolveScheduledStopPoint'),
        e,
      );
    }
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
      />
    </Marker>
  );
};
