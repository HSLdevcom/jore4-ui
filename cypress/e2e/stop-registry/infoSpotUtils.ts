import { BaseChangeHistoryTable } from '../../pageObjects/base-change-history';
import {
  ChangeHistoryTableInfoSpotChangedValues,
  ChangeHistoryTableInfoSpotSectionHeader,
} from '../../pageObjects/base-change-history/ChangeHistoryTableInfoSpotPageObjects';

type StringTuple = readonly [string, string];

export type InfoSpotData = {
  readonly label: StringTuple;
  readonly purpose: StringTuple;
  readonly size?: StringTuple;
  readonly backlight?: StringTuple;
  readonly floor?: StringTuple;
  readonly railInformation?: StringTuple;
  readonly zoneLabel?: StringTuple;
};

export function assertInfoSpot(
  assertChangeTypeHeader: () => void,
  assertLabel: () => void,
  assertChangedValues: (values: StringTuple) => () => void,
  infoSpotData: InfoSpotData,
) {
  const sectionHeader = {
    ...BaseChangeHistoryTable.sectionHeader,
    ...ChangeHistoryTableInfoSpotSectionHeader,
  };
  const infoSpotDetails = ChangeHistoryTableInfoSpotChangedValues;

  sectionHeader
    .getInfoSpotDetails()
    .within(() => sectionHeader.getTitle().contains('Infopaikat'));

  assertChangeTypeHeader();

  infoSpotDetails.getLabel().within(assertLabel);

  infoSpotDetails
    .getPurpose()
    .within(assertChangedValues(infoSpotData.purpose));

  if (infoSpotData.size) {
    infoSpotDetails.getSize().within(assertChangedValues(infoSpotData.size));
  }

  if (infoSpotData.backlight) {
    infoSpotDetails
      .getBacklight()
      .within(assertChangedValues(infoSpotData.backlight));
  }

  if (infoSpotData.floor) {
    infoSpotDetails.getFloor().within(assertChangedValues(infoSpotData.floor));
  }

  if (infoSpotData.railInformation) {
    infoSpotDetails
      .getRailInformation()
      .within(assertChangedValues(infoSpotData.railInformation));
  }

  if (infoSpotData.zoneLabel) {
    infoSpotDetails
      .getZoneLabel()
      .within(assertChangedValues(infoSpotData.zoneLabel));
  }
}
