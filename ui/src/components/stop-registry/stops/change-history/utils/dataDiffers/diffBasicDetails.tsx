import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { FC } from 'react';
import { PulseLoader } from 'react-spinners';
import { theme } from '../../../../../../generated/theme';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../../../i18n/uiNameMappings';
import {
  ChangedValue,
  diffValues,
  mapNullable,
} from '../../../../../common/ChangeHistory';
import { useGetTimingPlaceLabel } from '../../../queries/useGetTimingPlaceLabel';
import { optionalBooleanToUiText } from '../../../stop-details/utils';
import { HistoricalStopData } from '../../types';

type TimingPlaceLabelProps = { readonly timingPlaceId: string | null };

const TimingPlaceLabel: FC<TimingPlaceLabelProps> = ({ timingPlaceId }) => {
  const { timingPlaceLabel, loading } = useGetTimingPlaceLabel(timingPlaceId);

  if (timingPlaceId === null) {
    return '-';
  }

  if (loading) {
    return <PulseLoader color={theme.colors.brand} size={12} />;
  }

  return timingPlaceLabel ?? timingPlaceId;
};

export function diffBasicDetails(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  const changes = [
    diffValues({
      field: t('stopDetails.basicDetails.label'),
      oldValue: previous.quay.publicCode,
      newValue: current.quay.publicCode,
    }),
    diffValues({
      field: t('stopDetails.basicDetails.privateCode'),
      oldValue: previous.quay.privateCode,
      newValue: current.quay.privateCode,
    }),
    diffValues({
      field: t('stopDetails.basicDetails.locationFin'),
      oldValue: previous.quay.locationFin,
      newValue: current.quay.locationFin,
    }),
    diffValues({
      field: t('stopDetails.basicDetails.locationSwe'),
      oldValue: previous.quay.locationSwe,
      newValue: current.quay.locationSwe,
    }),
    diffValues({
      field: t('stopDetails.basicDetails.stopState'),
      oldValue: previous.quay.stopState,
      newValue: current.quay.stopState,
      mapper: mapNullable((v) => mapStopPlaceStateToUiName(t, v)),
    }),
    diffValues({
      field: t('stopDetails.basicDetails.transportMode'),
      oldValue: previous.stop_place.transportMode,
      newValue: current.stop_place.transportMode,
      mapper: mapNullable((v) =>
        mapStopRegistryTransportModeTypeToUiName(t, v),
      ),
    }),
    diffValues({
      field: t('stopDetails.basicDetails.elyNumber'),
      oldValue: previous.quay.elyNumber,
      newValue: current.quay.elyNumber,
    }),
    diffValues({
      field: t('stops.timingPlaceId'),
      oldValue: previous.quay.timingPlaceId,
      newValue: current.quay.timingPlaceId,
      mapper: (id) => <TimingPlaceLabel timingPlaceId={id} />,
    }),
    diffValues({
      field: t('stopPlaceTypes.railReplacement'),
      oldValue: previous.quay.stopType.railReplacement,
      newValue: current.quay.stopType.railReplacement,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffValues({
      field: t('stopPlaceTypes.virtual'),
      oldValue: previous.quay.stopType.virtual,
      newValue: current.quay.stopType.virtual,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
  ];

  return compact(changes);
}
