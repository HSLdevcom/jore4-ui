import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl/maplibre';
import { MemberStopFieldsFragment } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { useAppAction } from '../../../hooks';
import { useResolveScheduledStopPointByStopPlaceRef } from '../../../hooks/stop-areas/useResolveScheduledStopPointByStopPlaceRef';
import {
  setEditedStopDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { getGeometryPoint, showDangerToastWithError } from '../../../utils';
import { Circle } from '../markers';

const testIds = {
  memberStop: ({ id }: MemberStopFieldsFragment) =>
    `Map::StopArea::memberStop::${id}`,
};

type MemberStopProps = {
  readonly stop: MemberStopFieldsFragment;
};

export const MemberStop = ({ stop }: MemberStopProps) => {
  const { t } = useTranslation();

  const resolveScheduledStopPoint =
    useResolveScheduledStopPointByStopPlaceRef();
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);

  const onClick = async () => {
    if (!stop.netex_id) {
      return;
    }

    try {
      const scheduledStopPoint = await resolveScheduledStopPoint(stop.netex_id);
      setSelectedMapStopAreaId(undefined);
      setSelectedStopId(scheduledStopPoint.scheduled_stop_point_id);
      setEditedStopData(scheduledStopPoint);
    } catch (e) {
      showDangerToastWithError(
        t('stopArea.errors.failed_to_resolve_scheduled_stop_point'),
        e,
      );
    }
  };

  const point = getGeometryPoint(stop.centroid);
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
