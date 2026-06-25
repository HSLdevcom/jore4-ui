import { createPageObjectWithIdSelectors } from '../createSimplePageObject';

export const ChangeHistoryTableInfoSpotSectionHeader = {
  getInfoSpotDetails: () =>
    cy.getByTestId('ChangeHistory::SectionHeader::InfoSpotDetails'),
};

export const ChangeHistoryTableInfoSpotChangedValues =
  createPageObjectWithIdSelectors(
    'ChangeHistory::ChangedValues::InfoSpotDetails',
    [
      'ChangeHistory::ChangedValues::InfoSpotDetails::Added',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Updated',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Removed',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Label',
      'ChangeHistory::ChangedValues::InfoSpotDetails::IntendedUser',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Size',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Backlight',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Floor',
      'ChangeHistory::ChangedValues::InfoSpotDetails::ZoneLabel',
      'ChangeHistory::ChangedValues::InfoSpotDetails::RailInformation',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Description',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Latitude',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Longitude',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Posters',
    ],
  );
