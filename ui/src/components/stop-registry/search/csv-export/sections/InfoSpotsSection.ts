/* eslint-disable no-restricted-syntax,max-classes-per-file */
import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import noop from 'lodash/noop';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { getPointPosition } from '../../../../../utils';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { formatSizedDbItem } from '../../../stops/stop-details/info-spots/utils';
import {
  EnrichedQuayWithTimingPlace,
  EnrichedStopDetails,
  EnrichedStopDetailsWithSelectedInfoSpot,
  ReportSection,
} from '../types';
import { dynamicSection, writeHeaderArray } from './utils';

// In this file the words Shelter, InfoSpot and Poster can, depending on the
// context refer to either a single individual database entity, or to the more
// generic consept of "Nth shelter" or "Nth InfoSpot on the Nth Shelter".

const missingShelterNumber = 0;

type PostersPerInfoSpot = {
  [InfoSpotNumber: number | string]: number;
};

// Max count of posters per InfoSpot number per Shelter number
type Counts = {
  [ShelterNumber: number | string]: PostersPerInfoSpot;
};

type GenerateInfoSpotHeaderTContext = {
  readonly shelterNumber: number | string;
  readonly infoSpotNumber: number | string;
  readonly posterNumber?: number | string;
};

type GenerateInfoSpotHeader = (
  t: TFunction,
  context: GenerateInfoSpotHeaderTContext,
) => string;

const infoSpotHeaders: ReadonlyArray<GenerateInfoSpotHeader> = [
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.label', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.purpose', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.size', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.backlight', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.latitude', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.longitude', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.zoneLabel', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.railInformation', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.floor', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.description', context),
];

const singleInfoSpotHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.infoSpots.label'),
  (t) => t('stopDetails.infoSpots.purpose'),
  (t) => t('stopDetails.infoSpots.size'),
  (t) => t('stopDetails.infoSpots.backlight'),
  (t) => t('stopDetails.location.latitude'),
  (t) => t('stopDetails.location.longitude'),
  (t) => t('stopDetails.infoSpots.zoneLabel'),
  (t) => t('stopDetails.infoSpots.railInformation'),
  (t) => t('stopDetails.infoSpots.floor'),
  (t) => t('stopDetails.infoSpots.description'),
];

const posterHeaders: ReadonlyArray<GenerateInfoSpotHeader> = [
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.productSize', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.posterLabel', context),
  (t, context) =>
    t('stopDetails.infoSpots.equipmentReport.title.posterLines', context),
];

const singleInfoSpotPosterHeaders: ReadonlyArray<
  (t: TFunction, posterNumber: number) => string
> = [
  (t, posterNumber) =>
    t('stopDetails.infoSpots.infoSpotReport.title.productSize', {
      posterNumber,
    }),
  (t, posterNumber) =>
    t('stopDetails.infoSpots.infoSpotReport.title.posterLabel', {
      posterNumber,
    }),
  (t, posterNumber) =>
    t('stopDetails.infoSpots.infoSpotReport.title.posterLines', {
      posterNumber,
    }),
];

/**
 * Pre-analyze the data set to see, how many columns of data we are going to
 * generate onto the report.
 *
 * @param data
 */
function getFieldCounts(data: ReadonlyArray<EnrichedStopDetails>): Counts {
  const counts: Counts = {};

  for (const { quay } of data) {
    for (const shelter of quay.placeEquipments?.shelterEquipment ?? []) {
      const shelterId = shelter?.id ?? null;
      const shelterNumber = shelter?.shelterNumber ?? missingShelterNumber;

      // Make sure we have InfoSpot<>PosterCount container for the shelter
      // numbered `shelterNumber`.
      counts[shelterNumber] ??= {};

      // Find InfoSpots located at the given Shelter.
      const infoSpots = compact(quay.infoSpots).filter(
        ({ infoSpotLocations }) =>
          infoSpotLocations?.includes(shelterId) ?? false,
      );

      for (
        let infoSpotNumber = 1;
        infoSpotNumber <= infoSpots.length;
        infoSpotNumber += 1
      ) {
        // Update, if needed, the maximum poster count on the given
        // Shelter<>InfoSpot pair.
        counts[shelterNumber][infoSpotNumber] = Math.max(
          counts[shelterNumber][infoSpotNumber] ?? 0,
          compact(infoSpots[infoSpotNumber - 1].poster).length,
        );
      }
    }
  }

  return counts;
}

/**
 * Flatten the complex Shelter<>InfoSpot<>Poster count numbers into
 * raw field count number as per the generic ReportSection API.
 *
 * @param counts
 */
function getFlatFieldCount(counts: Counts): number {
  let fields = 0;

  for (const infoSpotsOfShelter of Object.values<PostersPerInfoSpot>(counts)) {
    const infoSpotCount = Object.keys(infoSpotsOfShelter).length;

    // Shelters with no InfoSpots on them, generate no columns.
    if (infoSpotCount > 0) {
      const posterCounts = Object.values(infoSpotsOfShelter).reduce(
        (r, c) => r + c,
        0,
      );

      fields += infoSpotHeaders.length;
      fields += posterCounts * posterHeaders.length;
    }
  }

  return fields;
}

type PosterDetails = Exclude<
  Exclude<InfoSpotDetailsFragment['poster'], null | undefined>[number],
  null | undefined
>;

/**
 * Map the consept of "Nth shelter" into actual Database IDs.
 * Due to the non-unique and optional nature of the ShelterNumber, the
 * CSV<>DBField mapping is not always one to one, and we might have InfoSpots
 * of multiple shelters map onto the same "CSV Report InfoSpot Shelter number"
 *
 * @param quay
 * @param shelterNumber
 */
function resolveShelterIds(
  quay: EnrichedQuayWithTimingPlace,
  shelterNumber: string,
) {
  return (
    quay.placeEquipments?.shelterEquipment
      ?.filter(
        (shelter) =>
          String(shelter?.shelterNumber ?? missingShelterNumber) ===
          shelterNumber,
      )
      .map((shelter) => shelter?.id) ?? []
  );
}

/**
 * Resolve actual Database InfoSpots to the shelter(s) based on the previous
 * functions ID mapping.
 *
 * @param quay
 * @param shelterIds
 */
function resolveInfoSpots(
  quay: EnrichedQuayWithTimingPlace,
  shelterIds: ReadonlyArray<string | null | undefined>,
) {
  return compact(
    quay.infoSpots?.filter((infoSpot) =>
      infoSpot?.infoSpotLocations?.some((location) =>
        shelterIds.includes(location),
      ),
    ),
  );
}

/**
 * Write in the few poster details onto the Record row.
 *
 * @param writer
 * @param poster
 */
function writePosterFields(writer: CSVWriter, poster: PosterDetails) {
  const { t } = writer;

  writer.writeTextField(formatSizedDbItem(t, poster));
  writer.writeTextField(poster.label);
  writer.writeTextField(poster.lines);
}

/**
 * Write in empty placeholder fields for a "poster".
 *
 * @param writer
 */
function writeEmptyPoster(writer: CSVWriter) {
  writer.writeEmptyFields(posterHeaders.length);
}

/**
 * Write in proper InfoSpot field on the report.
 *
 * @param writer
 * @param infoSpot
 * @param expectedPosterCount
 */
function writeInfoSpotFields(
  writer: CSVWriter,
  infoSpot: InfoSpotDetailsFragment,
  expectedPosterCount: number,
) {
  const { t } = writer;
  const position = getPointPosition(infoSpot.geometry);

  writer.writeTextField(infoSpot.label);
  writer.writeTextField(infoSpot.purpose);
  writer.writeTextField(formatSizedDbItem(t, infoSpot));
  writer.writeBooleanField(
    infoSpot.backlight,
    t('stopDetails.infoSpots.backlight'),
  );

  writer.writeNumberField(position?.at(1));
  writer.writeNumberField(position?.at(0));

  writer.writeTextField(infoSpot.zoneLabel);
  writer.writeTextField(infoSpot.railInformation);
  writer.writeTextField(infoSpot.floor);

  writer.writeTextField(infoSpot.description?.value);

  const posters = compact(infoSpot.poster);
  for (let i = 0; i < expectedPosterCount; i += 1) {
    const poster = posters.at(i);
    if (poster) {
      writePosterFields(writer, poster);
    } else {
      writeEmptyPoster(writer);
    }
  }
}

/**
 * Write empty placeholder fields for "InfoSpot".
 *
 * @param writer
 * @param expectedPosterCount
 */
function writeEmptyInfoSpot(writer: CSVWriter, expectedPosterCount: number) {
  writer.writeEmptyFields(infoSpotHeaders.length);

  for (let i = 0; i < expectedPosterCount; i += 1) {
    writeEmptyPoster(writer);
  }
}

/**
 * Write in proper InfoSpot fields on the report.
 *
 * @param writer
 * @param quay
 * @param counts
 */
function writeInfoSpots(
  writer: CSVWriter,
  quay: EnrichedQuayWithTimingPlace,
  counts: Counts,
): void {
  for (const shelterNumber of Object.keys(counts)) {
    // There should only be a single shelter, but shelterNumber does not have
    // to be unique or even defined. We need to account for the case,
    // where multiple shelters map to the same number.
    const shelterIds = resolveShelterIds(quay, shelterNumber);

    const infoSpots = resolveInfoSpots(quay, shelterIds);

    const expectedInfoSpotCountForShelter = Object.values(
      counts[shelterNumber],
    ).length;
    for (
      let infoSpotNumber = 1;
      infoSpotNumber <= expectedInfoSpotCountForShelter;
      infoSpotNumber += 1
    ) {
      const expectedPosterCount = counts[shelterNumber][infoSpotNumber];
      const infoSpot = infoSpots.at(infoSpotNumber - 1);

      if (infoSpot) {
        writeInfoSpotFields(writer, infoSpot, expectedPosterCount);
      } else {
        writeEmptyInfoSpot(writer, expectedPosterCount);
      }
    }
  }
}

const noInfoSpotsSectionImplementation: ReportSection = {
  shouldHavePadding: true,
  fieldCount: 0,
  writeMetaHeaders: noop,
  writeHeader: noop,
  writeRecordFields: noop,
};

class InfoSpotsSectionImplementation implements ReportSection {
  private readonly counts: Counts;

  readonly shouldHavePadding = true;

  readonly fieldCount: number;

  constructor(counts: Counts, fieldCount: number) {
    this.counts = counts;
    this.fieldCount = fieldCount;
  }

  writeMetaHeaders(writer: CSVWriter) {
    const { t } = writer;

    for (const [shelterNumber, infoSpotsOfShelter] of Object.entries(
      this.counts,
    )) {
      for (const posterCount of Object.values(infoSpotsOfShelter)) {
        writer.writeTextField(
          t('stopDetails.infoSpots.equipmentReport.title.metaHeader', {
            shelterNumber,
          }).toLocaleUpperCase(),
        );
        writer.writeEmptyFields(infoSpotHeaders.length - 1);
        writer.writeEmptyFields(posterHeaders.length * posterCount);
      }
    }
  }

  writeHeader(writer: CSVWriter) {
    const { t } = writer;

    for (const [shelterNumber, infoSpotsOfShelter] of Object.entries(
      this.counts,
    )) {
      for (const [infoSpotNumber, posterCount] of Object.entries(
        infoSpotsOfShelter,
      )) {
        const infoSpotContext = { shelterNumber, infoSpotNumber };
        infoSpotHeaders.forEach((genHeader) =>
          writer.writeTextField(genHeader(t, infoSpotContext)),
        );

        for (
          let posterNumber = 1;
          posterNumber <= posterCount;
          posterNumber += 1
        ) {
          posterHeaders.forEach((genHeader) =>
            writer.writeTextField(
              genHeader(t, { ...infoSpotContext, posterNumber }),
            ),
          );
        }
      }
    }
  }

  writeRecordFields(writer: CSVWriter, { quay }: EnrichedStopDetails) {
    const infoSpots = compact(quay.infoSpots);

    if (infoSpots.length === 0) {
      writer.writeEmptyFields(this.fieldCount);
    } else {
      writeInfoSpots(writer, quay, this.counts);
    }
  }
}

export const InfoSpotsSection = dynamicSection((data) => {
  const counts = getFieldCounts(data);
  const flatFieldCount = getFlatFieldCount(counts);

  if (flatFieldCount === 0) {
    return noInfoSpotsSectionImplementation;
  }

  return new InfoSpotsSectionImplementation(counts, flatFieldCount);
});

class SingleInfoSposSectionImplementation
  implements ReportSection<EnrichedStopDetailsWithSelectedInfoSpot>
{
  private readonly maxPosters: number;

  readonly shouldHavePadding = true;

  readonly fieldCount: number;

  constructor(maxPosters: number) {
    this.maxPosters = maxPosters;
    this.fieldCount =
      singleInfoSpotHeaders.length +
      singleInfoSpotPosterHeaders.length * maxPosters;
  }

  writeMetaHeaders(writer: CSVWriter) {
    const { t } = writer;

    writer.writeTextField(t('stopDetails.infoSpots.title').toLocaleUpperCase());
    writer.writeEmptyFields(this.fieldCount - 1);
  }

  writeHeader(writer: CSVWriter) {
    const { t } = writer;

    writeHeaderArray(writer, singleInfoSpotHeaders);

    for (let i = 0; i < this.maxPosters; i += 1) {
      singleInfoSpotPosterHeaders.forEach((genHeader) =>
        writer.writeTextField(genHeader(t, i + 1)),
      );
    }
  }

  writeRecordFields(
    writer: CSVWriter,
    { quay, infoSpotId }: EnrichedStopDetailsWithSelectedInfoSpot,
  ) {
    const infoSpot = quay.infoSpots?.find((it) => it?.id === infoSpotId);

    if (!infoSpot || infoSpotId === null) {
      writeEmptyInfoSpot(writer, this.maxPosters);
    } else {
      writeInfoSpotFields(writer, infoSpot, this.maxPosters);
    }
  }
}

export const SingleInfoSpotsSection =
  dynamicSection<EnrichedStopDetailsWithSelectedInfoSpot>((data) => {
    const maxPosters = data
      .values()
      .flatMap((it) => it.quay.infoSpots ?? [])
      .map((infoSpot) => infoSpot?.poster)
      .map(compact)
      .map((posters) => posters.length)
      .reduce((a, b) => Math.max(a, b), 0);

    return new SingleInfoSposSectionImplementation(maxPosters);
  });
