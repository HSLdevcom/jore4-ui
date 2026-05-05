import {
  BaseChangeHistoryPage,
  BaseChangeHistoryTable,
} from '../base-change-history';
import {
  createPageObjectWithIdSelectors,
  createSimplePageObject,
} from '../createSimplePageObject';

const TerminalChangeHistoryTableInfoSpotChangedValues =
  createPageObjectWithIdSelectors(
    'ChangeHistory::ChangedValues::InfoSpotDetails',
    [
      'ChangeHistory::ChangedValues::InfoSpotDetails::Added',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Updated',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Removed',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Label',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Purpose',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Size',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Backlight',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Floor',
      'ChangeHistory::ChangedValues::InfoSpotDetails::ZoneLabel',
      'ChangeHistory::ChangedValues::InfoSpotDetails::RailInformation',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Description',
    ],
  );

const TerminalChangeHistoryTable = createSimplePageObject(
  'ChangeHistory',
  [
    // TerminalChangeHistoryFirstVersionHeaderRow
    'ChangeHistory::SectionHeader::CreatedTerminalVersion',
    'ChangeHistory::SectionHeader::ImportedTerminalVersion',

    // DataDiffFailedToLoadSection
    'ChangeHistory::SectionHeader::FailedToLoadTerminalData',
    'ChangeHistory::FailedToLoadTerminalData::RetryButton',

    // DataDiffSectionLoading
    'ChangeHistory::SectionHeader::LoadingTerminalData',

    // TerminalDetailsChangedSectionRow
    'ChangeHistory::SectionHeader::TerminalDetails',
    'ChangeHistory::SectionHeader::TerminalExternalLinks',
    'ChangeHistory::SectionHeader::TerminalStops',
    'ChangeHistory::SectionHeader::InfoSpotDetails',
    'ChangeHistory::ChangedValues::TerminalDetails::NameFin',
    'ChangeHistory::ChangedValues::TerminalDetails::NameSwe',
    'ChangeHistory::ChangedValues::TerminalDetails::NameEng',
    'ChangeHistory::ChangedValues::TerminalDetails::LongNameFin',
    'ChangeHistory::ChangedValues::TerminalDetails::LongNameSwe',
    'ChangeHistory::ChangedValues::TerminalDetails::LongNameEng',
    'ChangeHistory::ChangedValues::TerminalDetails::AbbreviationFin',
    'ChangeHistory::ChangedValues::TerminalDetails::AbbreviationSwe',
    'ChangeHistory::ChangedValues::TerminalDetails::AbbreviationEng',
    'ChangeHistory::ChangedValues::TerminalDetails::Description',
    'ChangeHistory::ChangedValues::TerminalDetails::TerminalType',
    'ChangeHistory::ChangedValues::TerminalDetails::DeparturePlatforms',
    'ChangeHistory::ChangedValues::TerminalDetails::ArrivalPlatforms',
    'ChangeHistory::ChangedValues::TerminalDetails::LoadingPlatforms',
    'ChangeHistory::ChangedValues::TerminalDetails::ElectricCharging',
    'ChangeHistory::ChangedValues::TerminalDetails::ValidityStart',
    'ChangeHistory::ChangedValues::TerminalDetails::ValidityEnd',
    'ChangeHistory::ChangedValues::TerminalDetails::StreetAddress',
    'ChangeHistory::ChangedValues::TerminalDetails::PostalCode',
    'ChangeHistory::ChangedValues::TerminalDetails::Municipality',
    'ChangeHistory::ChangedValues::TerminalDetails::Latitude',
    'ChangeHistory::ChangedValues::TerminalDetails::Longitude',
    'ChangeHistory::ChangedValues::OwnerDetails::OwnerName',
    'ChangeHistory::ChangedValues::OwnerDetails::OwnerContractId',
    'ChangeHistory::ChangedValues::OwnerDetails::OwnerNote',
    'ChangeHistory::ChangedValues::TerminalExternalLinks::Links',
    'ChangeHistory::ChangedValues::TerminalStops::Stops',
  ],
  (base) => ({
    ...BaseChangeHistoryTable,
    ...base,
    sectionHeader: {
      ...BaseChangeHistoryTable.sectionHeader,
      ...base.sectionHeader,
    },
    changedValues: {
      ...BaseChangeHistoryTable.changedValues,
      ...base.changedValues,
      infoSpotDetails: TerminalChangeHistoryTableInfoSpotChangedValues,
    },
  }),
);

export const TerminalChangeHistory = createSimplePageObject(
  'TerminalChangeHistoryPage',
  [
    // TerminalChangeHistoryPage
    'TerminalChangeHistoryPage::Container',

    // TerminalChangeHistoryPageTitleRow
    'TerminalChangeHistoryPage::ReturnButton',
    'TerminalChangeHistoryPage::Title',

    // TerminalChangeHistoryNames
    'TerminalChangeHistoryPage::Names',
  ],
  (base) => ({
    ...BaseChangeHistoryPage,
    ...base,
    changeHistoryTable: TerminalChangeHistoryTable,
  }),
);
