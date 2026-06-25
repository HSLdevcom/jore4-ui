import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { ReactNode } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import {
  mapIntendedUserToUiName,
  mapZoneLabelToUiName,
} from '../../../../../i18n/uiNameMappings';
import { getGeometryPoint } from '../../../../../utils';
import {
  ChangedValue,
  EmptyCell,
  KeyedChangedValue,
  diffKeyedValues,
  mapNullable,
} from '../../../../common/ChangeHistory';
import { formatSizedDbItem } from '../../../stops/stop-details/info-spots/utils';
import { formatPurposeForDisplay } from '../../../stops/stop-details/info-spots/utils/infoSpotPurposeUtils';
import { optionalBooleanToUiText } from '../../../stops/stop-details/utils';
import { normalizeZoneLabel } from '../../../types/utils';

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
    .sort((a, b) => (a.id ?? '').localeCompare(b.id ?? ''))
    .map((poster) => ({
      id: poster.id ?? '',
      fieldValues: [
        fv(
          t(($) => $.stopDetails.infoSpots.posterSize),
          formatSizedDbItem(t, poster),
        ),
        fv(
          t(($) => $.stopDetails.infoSpots.posterPurpose),
          formatPurposeForDisplay(t, poster.label),
        ),
        fv(
          t(($) => $.stopDetails.infoSpots.posterLines),
          poster.lines,
        ),
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
              <li key={field}>{`${field}: ${value.trim() || '-'}`}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function diffInfoSpotVersions(
  t: TFunction,
  previous: InfoSpotDetailsFragment | null,
  current: InfoSpotDetailsFragment | null,
): Array<KeyedChangedValue> {
  const previousPoint = getGeometryPoint(previous?.geometry);
  const currentPoint = getGeometryPoint(current?.geometry);

  return compact([
    diffKeyedValues({
      key: 'Label',
      field: t(($) => $.stopDetails.infoSpots.label),
      oldValue: previous?.label,
      newValue: current?.label,
    }),
    diffKeyedValues({
      key: 'IntendedUser',
      field: t(($) => $.stopDetails.infoSpots.intendedUser),
      oldValue: previous?.intendedUser,
      newValue: current?.intendedUser,
      mapper: mapNullable((v) => mapIntendedUserToUiName(t, v)),
    }),
    diffKeyedValues({
      key: 'Size',
      field: t(($) => $.stopDetails.infoSpots.size),
      oldValue: previous && formatSizedDbItem(t, previous),
      newValue: current && formatSizedDbItem(t, current),
    }),
    diffKeyedValues({
      key: 'Backlight',
      field: t(($) => $.stopDetails.infoSpots.backlight),
      oldValue: previous?.backlight,
      newValue: current?.backlight,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),

    diffKeyedValues({
      key: 'Latitude',
      field: t(($) => $.stopDetails.location.latitude),
      oldValue: previousPoint?.latitude,
      newValue: currentPoint?.latitude,
    }),
    diffKeyedValues({
      key: 'Longitude',
      field: t(($) => $.stopDetails.location.longitude),
      oldValue: previousPoint?.longitude,
      newValue: currentPoint?.longitude,
    }),

    diffKeyedValues({
      key: 'ZoneLabel',
      field: t(($) => $.stopDetails.infoSpots.zoneLabel),
      oldValue: previous?.zoneLabel,
      newValue: current?.zoneLabel,
      mapper: (v) => mapZoneLabelToUiName(t, normalizeZoneLabel(v)),
    }),
    diffKeyedValues({
      key: 'RailInformation',
      field: t(($) => $.stopDetails.infoSpots.railInformation),
      oldValue: previous?.railInformation,
      newValue: current?.railInformation,
    }),
    diffKeyedValues({
      key: 'Floor',
      field: t(($) => $.stopDetails.infoSpots.floor),
      oldValue: previous?.floor,
      newValue: current?.floor,
    }),
    diffKeyedValues({
      key: 'Description',
      field: t(($) => $.stopDetails.infoSpots.description),
      oldValue: previous?.description?.value,
      newValue: current?.description?.value,
    }),

    diffKeyedValues({
      key: 'Posters',
      field: t(($) => $.changeHistory.infoSpots.posters),
      oldValue: previous && preparePosters(t, previous),
      newValue: current && preparePosters(t, current),
      mapper: mapInfoPosters,
    }),
  ]);
}

export function getAddedInfoSpotHeading(
  t: TFunction,
  infoSpot: InfoSpotDetailsFragment,
): ChangedValue {
  return {
    key: `Added::${infoSpot.id}`,
    field: null,
    oldValue: <EmptyCell />,
    newValue: (
      <span className="font-bold">
        {t(($) => $.changeHistory.infoSpots.added)}
      </span>
    ),
  };
}

export function getUpdatedInfoSpotHeading(
  t: TFunction,
  previous: InfoSpotDetailsFragment,
): ChangedValue {
  return {
    key: `Updated::${previous.id}`,
    field: null,
    oldValue: (
      <span className="font-bold">
        {t(($) => $.changeHistory.infoSpots.updated)}
      </span>
    ),
    newValue: <EmptyCell />,
  };
}

export function getRemovedInfoSpotHeading(
  t: TFunction,
  infoSpot: InfoSpotDetailsFragment,
): ChangedValue {
  return {
    key: `Removed::${infoSpot.id}`,
    field: null,
    oldValue: (
      <span className="font-bold">
        {t(($) => $.changeHistory.infoSpots.removed)}
      </span>
    ),
    newValue: <EmptyCell />,
  };
}
