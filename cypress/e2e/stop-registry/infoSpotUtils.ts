import { StopChangeHistoryPage } from '../../pageObjects/stop-registry/StopChangeHistoryPage';

export type InfoSpotData = {
  readonly label: readonly [string, string];
  readonly purpose: readonly [string, string];
  readonly size?: readonly [string, string];
  readonly backlight?: readonly [string, string];
  readonly floor?: readonly [string, string];
  readonly railInformation?: readonly [string, string];
  readonly zoneLabel?: readonly [string, string];
};

type SectionHeader = Pick<
  typeof StopChangeHistoryPage.changeHistoryTable.sectionHeader,
  'getInfoSpotDetails' | 'getTitle'
>;
type InfoSpotDetails = Pick<
  typeof StopChangeHistoryPage.changeHistoryTable.changedValues.infoSpotDetails,
  | 'getLabel'
  | 'getPurpose'
  | 'getSize'
  | 'getBacklight'
  | 'getFloor'
  | 'getRailInformation'
  | 'getZoneLabel'
>;

export function assertInfoSpot(
  sectionHeader: SectionHeader,
  infoSpotDetails: InfoSpotDetails,
  assertChangeTypeHeader: () => void,
  assertLabel: () => void,
  assertProperInputFields: (values: readonly [string, string]) => () => void,
  infoSpotData: InfoSpotData,
) {
  sectionHeader
    .getInfoSpotDetails()
    .within(() => sectionHeader.getTitle().contains('Infopaikat'));

  assertChangeTypeHeader();

  infoSpotDetails.getLabel().within(assertLabel);

  infoSpotDetails
    .getPurpose()
    .within(assertProperInputFields(infoSpotData.purpose));

  if (infoSpotData.size) {
    infoSpotDetails
      .getSize()
      .within(assertProperInputFields(infoSpotData.size));
  }

  if (infoSpotData.backlight) {
    infoSpotDetails
      .getBacklight()
      .within(assertProperInputFields(infoSpotData.backlight));
  }

  if (infoSpotData.floor) {
    infoSpotDetails
      .getFloor()
      .within(assertProperInputFields(infoSpotData.floor));
  }

  if (infoSpotData.railInformation) {
    infoSpotDetails
      .getRailInformation()
      .within(assertProperInputFields(infoSpotData.railInformation));
  }

  if (infoSpotData.zoneLabel) {
    infoSpotDetails
      .getZoneLabel()
      .within(assertProperInputFields(infoSpotData.zoneLabel));
  }
}
