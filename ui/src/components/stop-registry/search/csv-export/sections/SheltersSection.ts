import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import noop from 'lodash/noop';
import { ShelterEquipmentDetailsFragment } from '../../../../../generated/graphql';
import {
  mapStopRegistryShelterConditionEnumToUiName,
  mapStopRegistryShelterElectricityEnumToUiName,
  mapStopRegistryShelterTypeEnumToUiName,
} from '../../../../../i18n/uiNameMappings';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import {
  EnrichedStopDetails,
  EnrichedStopDetailsWithSelectedInfoSpot,
  ReportSection,
} from '../types';
import { dynamicSection, staticSection, writeHeaderArray } from './utils';

const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.shelters.shelterNumber'),
  (t) => t('stopDetails.shelters.shelterExternalId'),
  (t) => t('stopDetails.shelters.shelterType'),
  (t) => t('stopDetails.shelters.shelterElectricity'),
  (t) => t('stopDetails.shelters.shelterLighting'),
  (t) => t('stopDetails.shelters.shelterCondition'),
  (t) => t('stopDetails.shelters.timetableCabinets'),
  (t) => t('stopDetails.shelters.trashCan'),
  (t) => t('stopDetails.shelters.shelterHasDisplay'),
  (t) => t('stopDetails.shelters.bicycleParking'),
  (t) => t('stopDetails.shelters.leaningRail'),
  (t) => t('stopDetails.shelters.outsideBench'),
  (t) => t('stopDetails.shelters.shelterFasciaBoardTaping'),
];

function writeEmptyShelter(writer: CSVWriter) {
  writer.writeEmptyFields(headers.length);
}

function writeProperShelter(
  writer: CSVWriter,
  shelter: ShelterEquipmentDetailsFragment,
) {
  const { t } = writer;

  writer.writeNumberField(shelter.shelterNumber);
  writer.writeTextField(shelter.shelterExternalId);
  writer.writeEnumField(
    shelter.shelterType,
    mapStopRegistryShelterTypeEnumToUiName,
  );
  writer.writeEnumField(
    shelter.shelterElectricity,
    mapStopRegistryShelterElectricityEnumToUiName,
  );
  writer.writeBooleanField(
    shelter.shelterLighting,
    t('stopDetails.shelters.shelterLighting'),
  );
  writer.writeEnumField(
    shelter.shelterCondition,
    mapStopRegistryShelterConditionEnumToUiName,
  );
  writer.writeNumberField(shelter.timetableCabinets);

  writer.writeBooleanField(
    shelter.trashCan,
    t('stopDetails.shelters.trashCan'),
  );
  writer.writeBooleanField(
    shelter.shelterHasDisplay,
    t('stopDetails.shelters.shelterHasDisplay'),
  );
  writer.writeBooleanField(
    shelter.bicycleParking,
    t('stopDetails.shelters.bicycleParking'),
  );
  writer.writeBooleanField(
    shelter.leaningRail,
    t('stopDetails.shelters.leaningRail'),
  );
  writer.writeBooleanField(
    shelter.outsideBench,
    t('stopDetails.shelters.outsideBench'),
  );
  writer.writeBooleanField(
    shelter.shelterFasciaBoardTaping,
    t('stopDetails.shelters.shelterFasciaBoardTaping'),
  );
}

const noSheltersSectionImplementation: ReportSection = {
  shouldHavePadding: true,
  fieldCount: 0,
  writeMetaHeaders: noop,
  writeHeader: noop,
  writeRecordFields: noop,
};

class SheltersSectionImplementation implements ReportSection {
  readonly shouldHavePadding = true;

  private readonly subSections: number;

  readonly fieldCount: number;

  public constructor(subSections: number) {
    this.subSections = subSections;
    this.fieldCount = subSections * headers.length;
  }

  writeMetaHeaders(writer: CSVWriter) {
    const { t } = writer;

    for (let number = 1; number <= this.subSections; number += 1) {
      writer.writeTextField(
        t('stopDetails.shelters.csvHeaderPrefix', {
          number,
        }).toLocaleUpperCase(),
      );
      writer.writeEmptyFields(headers.length - 1);
    }
  }

  writeHeader(writer: CSVWriter) {
    for (let number = 1; number <= this.subSections; number += 1) {
      writeHeaderArray(
        writer,
        headers.map(
          (getFieldName) => (t: TFunction) =>
            t('stopDetails.shelters.csvHeaderPrefixAndFieldName', {
              number,
              fieldName: getFieldName(t),
            }),
        ),
      );
    }
  }

  writeRecordFields(writer: CSVWriter, record: EnrichedStopDetails) {
    const shelters = compact(
      record.quay.placeEquipments?.shelterEquipment,
    ).sort((a, b) => {
      const aNumber = a.shelterNumber ?? 0;
      const bNumber = b.shelterNumber ?? 0;

      return aNumber - bNumber;
    });

    for (let i = 0; i < this.subSections; i += 1) {
      const shelter = shelters.at(i);

      if (shelter) {
        writeProperShelter(writer, shelter);
      } else {
        writeEmptyShelter(writer);
      }
    }
  }
}

export const SheltersSection = dynamicSection(
  (data: ReadonlyArray<EnrichedStopDetails>): ReportSection => {
    const maxShelterCount = data
      .map((stop) => stop.quay.placeEquipments?.shelterEquipment?.length ?? 0)
      .reduce((m, n) => Math.max(m, n));

    if (maxShelterCount === 0) {
      return noSheltersSectionImplementation;
    }

    return new SheltersSectionImplementation(maxShelterCount);
  },
);

export const ShelterCountSection = staticSection(
  [],
  [(t) => t('stopDetails.shelters.csvCount')],
  (writer, record) =>
    writer.writeNumberField(
      record.quay.placeEquipments?.shelterEquipment?.length ?? 0,
    ),
  false,
);

export const SingularShelterSection =
  staticSection<EnrichedStopDetailsWithSelectedInfoSpot>(
    [(t) => t('stopRegistrySearch.csv.metaHeaders.shelter')],
    headers,
    // eslint-disable-next-line consistent-return
    (writer, record) => {
      if (record.infoSpotId === null) {
        return writeEmptyShelter(writer);
      }

      const infoSpotLocations =
        record.quay.infoSpots?.find(
          (infoSpot) => infoSpot?.id === record.infoSpotId,
        )?.infoSpotLocations ?? [];

      const shelter = record.quay.placeEquipments?.shelterEquipment?.find(
        (it) => infoSpotLocations.includes(it?.id as string),
      );

      if (shelter) {
        writeProperShelter(writer, shelter);
      } else {
        writeEmptyShelter(writer);
      }
    },
  );
