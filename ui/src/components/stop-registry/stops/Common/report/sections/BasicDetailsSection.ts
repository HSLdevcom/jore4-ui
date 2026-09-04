import { TFunction } from 'i18next';
import { getRouteLabelVariantText } from '../../../../../../utils';
import {
  mapDirectionToUiName,
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../../../utils/i18n';
import { CSVWriter } from '../../../../../common/ReportWriter/CSVWriter';
import {
  EnrichedStopDetails,
  ReportContext,
  ReportRouteContext,
} from '../types';
import { dynamicSection, writeHeaderArray } from './utils';

// Headers written before the (optional) route columns, ending with the
// transport mode. Route columns are inserted right after this.
const headersBeforeRoute: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t(($) => $.stopDetails.basicDetails.label),

  (t) => t(($) => $.stopDetails.basicAreaDetails.areaName),
  (t) => t(($) => $.stopDetails.basicAreaDetails.areaNameSwe),
  (t) => t(($) => $.stopDetails.basicAreaDetails.areaNameEng),

  (t) => t(($) => $.stopDetails.basicDetails.elyNumber),
  (t) => t(($) => $.stopDetails.basicAreaDetails.areaPrivateCode),
  (t) => t(($) => $.stopDetails.basicDetails.privateCode),

  (t) => t(($) => $.stopDetails.alternativeNames.nameLongFin),
  (t) => t(($) => $.stopDetails.alternativeNames.nameLongSwe),
  (t) => t(($) => $.stopDetails.alternativeNames.nameLongEng),

  (t) => t(($) => $.stopDetails.alternativeNames.abbreviationFin),
  (t) => t(($) => $.stopDetails.alternativeNames.abbreviationSwe),
  (t) => t(($) => $.stopDetails.alternativeNames.abbreviationEng),

  (t) => t(($) => $.stopDetails.basicDetails.locationFin),
  (t) => t(($) => $.stopDetails.basicDetails.locationSwe),

  (t) => t(($) => $.stopDetails.basicDetails.stopState),
  (t) => t(($) => $.stopDetails.basicDetails.transportMode),
];

const routeHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t(($) => $.stopRegistrySearch.csv.routeColumns.route),
  (t) => t(($) => $.stopRegistrySearch.csv.routeColumns.direction),
];

const headersAfterRoute: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t(($) => $.stops.timingPlaceId),
  (t) => t(($) => $.stopPlaceTypes.railReplacement),
  (t) => t(($) => $.stopPlaceTypes.virtual),
];

function buildHeaders(
  includeRoute: boolean,
): ReadonlyArray<(t: TFunction) => string> {
  return includeRoute
    ? [...headersBeforeRoute, ...routeHeaders, ...headersAfterRoute]
    : [...headersBeforeRoute, ...headersAfterRoute];
}

function formatRouteName(route: ReportRouteContext): string {
  const labelWithVariant = getRouteLabelVariantText({
    label: route.label,
    variant: route.variant,
  });
  return [labelWithVariant, route.name].filter(Boolean).join(' ');
}

function writeRecordFields(
  writer: CSVWriter,
  { quay, stopPlace }: EnrichedStopDetails,
  route: ReportRouteContext | undefined,
) {
  const { t } = writer;

  writer.writeTextField(quay.publicCode);

  writer.writeTextField(stopPlace.name);
  writer.writeTextField(stopPlace.nameSwe);
  writer.writeTextField(stopPlace.nameEng);

  writer.writeTextField(quay.elyNumber);
  writer.writeTextField(stopPlace.privateCode?.value);
  writer.writeTextField(quay.privateCode?.value);

  writer.writeTextField(stopPlace.nameLongFin);
  writer.writeTextField(stopPlace.nameLongSwe);
  writer.writeTextField(stopPlace.nameLongEng);

  writer.writeTextField(stopPlace.abbreviationFin);
  writer.writeTextField(stopPlace.abbreviationSwe);
  writer.writeTextField(stopPlace.abbreviationEng);

  writer.writeTextField(quay.locationFin);
  writer.writeTextField(quay.locationSwe);

  writer.writeEnumField(quay.stopState, mapStopPlaceStateToUiName);
  writer.writeEnumField(
    stopPlace.transportMode,
    mapStopRegistryTransportModeTypeToUiName,
  );

  if (route) {
    writer.writeTextField(formatRouteName(route));
    writer.writeEnumField(route.direction, mapDirectionToUiName);
  }

  writer.writeTextField(quay.timingPlace);
  writer.writeBooleanField(
    quay.stopType.railReplacement,
    t(($) => $.stopPlaceTypes.railReplacement),
  );
  writer.writeBooleanField(
    quay.stopType.virtual,
    t(($) => $.stopPlaceTypes.virtual),
  );
}

export const BasicDetailsSection = dynamicSection(
  (_data, context: ReportContext) => {
    const headers = buildHeaders(Boolean(context.route));

    return {
      fieldCount: headers.length,
      shouldHavePadding: true,
      writeMetaHeaders(writer: CSVWriter) {
        const { t } = writer;

        writer.writeTextField(
          t(($) => $.stopDetails.basicDetails.title).toLocaleUpperCase(),
        );
        writer.writeTextField(
          t(($) => $.filters.observationDate).toLocaleUpperCase(),
        );
        writer.writeDateField(context.observationDate);

        writer.writeEmptyFields(headers.length - 3);
      },
      writeHeader(writer: CSVWriter) {
        writeHeaderArray(writer, headers);
      },
      writeRecordFields(writer: CSVWriter, record: EnrichedStopDetails) {
        writeRecordFields(writer, record, context.route);
      },
    };
  },
);
