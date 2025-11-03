import { TFunction } from 'i18next';
import { StopRegistryStopPlaceOrganisationRelationshipType as StopOrganisationType } from '../../../../../generated/graphql';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails } from '../types';
import { staticSection } from './utils';

const metaHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.maintenance.title'),
];
const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.maintenance.maintainers.owner'),
  (t) => t('stopDetails.maintenance.maintainers.shelterMaintenance'),
  (t) => t('stopDetails.maintenance.maintainers.maintenance'),
  (t) => t('stopDetails.maintenance.maintainers.winterMaintenance'),
  (t) => t('stopDetails.maintenance.maintainers.infoUpkeep'),
  (t) => t('stopDetails.maintenance.maintainers.cleaning'),
];

function findOrganisationByType(
  { quay }: EnrichedStopDetails,
  type: StopOrganisationType,
): string | null {
  const match = quay.organisations?.find((o) => o?.relationshipType === type);
  return match?.organisation?.name ?? null;
}

function writeRecordFields(
  writer: CSVWriter,
  stopDetails: EnrichedStopDetails,
) {
  writer.writeTextField(
    findOrganisationByType(stopDetails, StopOrganisationType.Owner),
  );

  writer.writeTextField(
    findOrganisationByType(
      stopDetails,
      StopOrganisationType.ShelterMaintenance,
    ),
  );

  writer.writeTextField(
    findOrganisationByType(stopDetails, StopOrganisationType.Maintenance),
  );

  writer.writeTextField(
    findOrganisationByType(stopDetails, StopOrganisationType.WinterMaintenance),
  );

  writer.writeTextField(
    findOrganisationByType(stopDetails, StopOrganisationType.InfoUpkeep),
  );

  writer.writeTextField(
    findOrganisationByType(stopDetails, StopOrganisationType.Cleaning),
  );
}

export const MaintenanceDetailsSection = staticSection(
  metaHeaders,
  headers,
  writeRecordFields,
);
