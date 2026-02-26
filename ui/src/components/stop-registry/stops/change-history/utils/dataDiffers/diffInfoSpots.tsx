import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { ReactNode } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { getGeometryPoint } from '../../../../../../utils';
import {
  ChangedValue,
  EmptyCell,
  KeyedChangedValue,
  diffKeyedValues,
} from '../../../../../common/ChangeHistory';
import { formatSizedDbItem } from '../../../stop-details/info-spots/utils';
import { optionalBooleanToUiText } from '../../../stop-details/utils';
import { HistoricalStopData } from '../../types';
import { diffNestedItems } from './diffNestedItems';

type FieldValueTuple = readonly [string, string];
type PosterInfo = {
  readonly id: string;
  readonly fieldValues: ReadonlyArray<FieldValueTuple>;
};

function fv(field: string, value: string | null | undefined): FieldValueTuple {
  return [field, value?.trim() ?? ''];
}

function preparePosters(
  t: TFunction,
  infoSpot: InfoSpotDetailsFragment,
): Array<PosterInfo> {
  return compact(infoSpot.poster)
    .sort((a, b) => (a.id ?? '')?.localeCompare(b.id ?? ''))
    .map((poster) => ({
      id: poster.id ?? '',
      fieldValues: [
        fv(t('stopDetails.infoSpots.posterSize'), formatSizedDbItem(t, poster)),
        fv(t('stopDetails.infoSpots.posterLabel'), poster.label),
        fv(t('stopDetails.infoSpots.posterLines'), poster.lines),
      ],
    }));
}

function mapInfoPosters(info: ReadonlyArray<PosterInfo> | null): ReactNode {
  if (!info || info.length === 0) {
    return <EmptyCell />;
  }

  return (
    <ul>
      {info.map((poster) => (
        <li key={poster.id}>
          <ul>
            {poster.fieldValues.map(([field, value]) => (
              <li key={field}>{`${field}: ${value}`}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function diffInfoSpotVersions(
  t: TFunction,
  previous: InfoSpotDetailsFragment | null,
  current: InfoSpotDetailsFragment | null,
): Array<KeyedChangedValue> {
  const previousPoint = getGeometryPoint(previous?.geometry);
  const currentPoint = getGeometryPoint(current?.geometry);

  return compact([
    diffKeyedValues({
      key: 'Label',
      field: t('stopDetails.infoSpots.label'),
      oldValue: previous?.label,
      newValue: current?.label,
    }),
    diffKeyedValues({
      key: 'Purpose',
      field: t('stopDetails.infoSpots.purpose'),
      oldValue: previous?.purpose,
      newValue: current?.purpose,
    }),
    diffKeyedValues({
      key: 'Size',
      field: t('stopDetails.infoSpots.size'),
      oldValue: previous && formatSizedDbItem(t, previous),
      newValue: current && formatSizedDbItem(t, current),
    }),
    diffKeyedValues({
      key: 'Backlight',
      field: t('stopDetails.infoSpots.backlight'),
      oldValue: previous?.backlight,
      newValue: current?.backlight,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),

    diffKeyedValues({
      key: 'Latitude',
      field: t('stopDetails.location.latitude'),
      oldValue: previousPoint?.latitude,
      newValue: currentPoint?.latitude,
    }),
    diffKeyedValues({
      key: 'Longitude',
      field: t('stopDetails.location.longitude'),
      oldValue: previousPoint?.longitude,
      newValue: currentPoint?.longitude,
    }),

    diffKeyedValues({
      key: 'ZoneLabel',
      field: t('stopDetails.infoSpots.zoneLabel'),
      oldValue: previous?.zoneLabel,
      newValue: current?.zoneLabel,
    }),
    diffKeyedValues({
      key: 'RailInformation',
      field: t('stopDetails.infoSpots.railInformation'),
      oldValue: previous?.railInformation,
      newValue: current?.railInformation,
    }),
    diffKeyedValues({
      key: 'Floor',
      field: t('stopDetails.infoSpots.floor'),
      oldValue: previous?.floor,
      newValue: current?.floor,
    }),
    diffKeyedValues({
      key: 'Description',
      field: t('stopDetails.infoSpots.description'),
      oldValue: previous?.description,
      newValue: current?.description,
    }),

    diffKeyedValues({
      key: 'Posters',
      field: t('stopChangeHistory.infoSpots.posters'),
      oldValue: previous && preparePosters(t, previous),
      newValue: current && preparePosters(t, current),
      mapper: mapInfoPosters,
    }),
  ]);
}

function getAddedInfoSpotHeading(
  t: TFunction,
  infoSpot: InfoSpotDetailsFragment,
): ChangedValue {
  return {
    key: `Added::${infoSpot.id}`,
    field: null,
    oldValue: <EmptyCell />,
    newValue: (
      <span className="font-bold">
        {t('stopChangeHistory.infoSpots.added')}
      </span>
    ),
  };
}

function getUpdatedInfoSpotHeading(
  t: TFunction,
  previous: InfoSpotDetailsFragment,
  // current: InfoSpotEquipmentDetailsFragment,
): ChangedValue {
  return {
    key: `Updated::${previous.id}`,
    field: null,
    oldValue: (
      <span className="font-bold">
        {t('stopChangeHistory.infoSpots.updated')}
      </span>
    ),
    newValue: <EmptyCell />,
  };
}

function getRemovedInfoSpotHeading(
  t: TFunction,
  infoSpot: InfoSpotDetailsFragment,
): ChangedValue {
  return {
    key: `Removed::${infoSpot.id}`,
    field: null,
    oldValue: (
      <span className="font-bold">
        {t('stopChangeHistory.infoSpots.removed')}
      </span>
    ),
    newValue: <EmptyCell />,
  };
}

export function diffInfoSpots(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  return diffNestedItems({
    t,
    previousItems: previous.quay.infoSpots,
    currentItems: current.quay.infoSpots,
    diffItemVersions: diffInfoSpotVersions,
    getHeading: {
      added: getAddedInfoSpotHeading,
      updated: getUpdatedInfoSpotHeading,
      removed: getRemovedInfoSpotHeading,
    },
  });
}
