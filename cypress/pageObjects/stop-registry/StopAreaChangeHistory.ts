import {
  BaseChangeHistoryPage,
  BaseChangeHistoryTable,
} from '../base-change-history';
import { createSimplePageObject } from '../createSimplePageObject';

const StopAreaChangeHistoryTable = createSimplePageObject(
  'ChangeHistory',
  [
    // StopAreaChangeHistoryFirstVersionHeaderRow
    'ChangeHistory::SectionHeader::CreatedAreaVersion',
    'ChangeHistory::SectionHeader::ImportedAreaVersion',

    // DataDiffFailedToLoadSection
    'ChangeHistory::SectionHeader::FailedToLoadStopAreaData',
    'ChangeHistory::FailedToLoadStopAreaData::RetryButton',

    // DataDiffSectionLoading
    'ChangeHistory::SectionHeader::LoadingStopAreaData',

    // LineDetailsChangedSectionRow
    'ChangeHistory::SectionHeader::StopAreaDetails',
    'ChangeHistory::ChangedValues::StopAreaDetails::NameFin',
    'ChangeHistory::ChangedValues::StopAreaDetails::NameSwe',
    'ChangeHistory::ChangedValues::StopAreaDetails::NameEng',
    'ChangeHistory::ChangedValues::StopAreaDetails::LongNameFin',
    'ChangeHistory::ChangedValues::StopAreaDetails::LongNameSwe',
    'ChangeHistory::ChangedValues::StopAreaDetails::LongNameEng',
    'ChangeHistory::ChangedValues::StopAreaDetails::AbbreviationFin',
    'ChangeHistory::ChangedValues::StopAreaDetails::AbbreviationSwe',
    'ChangeHistory::ChangedValues::StopAreaDetails::AbbreviationEng',
    'ChangeHistory::ChangedValues::StopAreaDetails::ValidityStart',
    'ChangeHistory::ChangedValues::StopAreaDetails::ValidityEnd',
    'ChangeHistory::ChangedValues::StopAreaDetails::TransportMode',
    'ChangeHistory::ChangedValues::StopAreaDetails::Stops',
    'ChangeHistory::ChangedValues::StopAreaDetails::Latitude',
    'ChangeHistory::ChangedValues::StopAreaDetails::Longitude',
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
    },
  }),
);

export const StopAreaChangeHistory = createSimplePageObject(
  'StopAreaChangeHistoryPage',
  [
    // StopChangeHistoryPage
    'StopAreaChangeHistoryPage::Container',

    // StopChangeHistoryPageTitleRow
    'StopAreaChangeHistoryPage::ReturnButton',
    'StopAreaChangeHistoryPage::Title',

    // StopChangeHistoryNames
    'StopAreaChangeHistoryPage::Names',
  ],
  (base) => ({
    ...BaseChangeHistoryPage,
    ...base,
    changeHistoryTable: StopAreaChangeHistoryTable,
  }),
);
