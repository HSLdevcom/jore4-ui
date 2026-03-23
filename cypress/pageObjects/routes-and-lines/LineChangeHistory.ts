import {
  BaseChangeHistoryPage,
  BaseChangeHistoryTable,
} from '../base-change-history';
import {
  createPageObjectWithIdSelectors,
  createSimplePageObject,
} from '../createSimplePageObject';

const LineChangeHistoryTable = createSimplePageObject(
  'ChangeHistory',
  [
    // LineChangeFirstVersionHeaderRow
    'ChangeHistory::SectionHeader::InsertedLineVersion',
    'ChangeHistory::SectionHeader::InsertedRouteVersion',

    // LineChangeDeletedVersionHeaderRow
    'ChangeHistory::SectionHeader::DeletedLineVersion',
    'ChangeHistory::SectionHeader::DeletedRouteVersion',

    // DataDiffFailedToLoadSection
    'ChangeHistory::SectionHeader::FailedToLoadLineData',
    'ChangeHistory::FailedToLoadLineData::RetryButton',

    // DataDiffSectionLoading
    'ChangeHistory::SectionHeader::LoadingLineData',

    // LineDetailsChangedSectionRow
    'ChangeHistory::SectionHeader::LineDetails',
    'ChangeHistory::ChangedValues::LineDetails::Label',
    'ChangeHistory::ChangedValues::LineDetails::NameFi',
    'ChangeHistory::ChangedValues::LineDetails::NameSv',
    'ChangeHistory::ChangedValues::LineDetails::ShortNameFi',
    'ChangeHistory::ChangedValues::LineDetails::ShortNameSv',
    'ChangeHistory::ChangedValues::LineDetails::ValidityStart',
    'ChangeHistory::ChangedValues::LineDetails::ValidityEnd',
    'ChangeHistory::ChangedValues::LineDetails::Priority',
    'ChangeHistory::ChangedValues::LineDetails::PrimaryVehicleMode',
    'ChangeHistory::ChangedValues::LineDetails::TypeOfLine',
    'ChangeHistory::ChangedValues::LineDetails::TransportTarget',

    // LineDetailsChangedSectionRow
    'ChangeHistory::SectionHeader::RouteDetails',
    'ChangeHistory::ChangedValues::RouteDetails::Label',
    'ChangeHistory::ChangedValues::RouteDetails::Variant',
    'ChangeHistory::ChangedValues::RouteDetails::Direction',

    'ChangeHistory::ChangedValues::RouteDetails::NameFi',
    'ChangeHistory::ChangedValues::RouteDetails::NameSv',

    'ChangeHistory::ChangedValues::RouteDetails::DescriptionFi',
    'ChangeHistory::ChangedValues::RouteDetails::DescriptionSv',

    'ChangeHistory::ChangedValues::RouteDetails::OriginNameFi',
    'ChangeHistory::ChangedValues::RouteDetails::OriginNameSv',

    'ChangeHistory::ChangedValues::RouteDetails::OriginNameShortFi',
    'ChangeHistory::ChangedValues::RouteDetails::OriginNameShortSv',

    'ChangeHistory::ChangedValues::RouteDetails::DestinationNameFi',
    'ChangeHistory::ChangedValues::RouteDetails::DestinationNameSv',

    'ChangeHistory::ChangedValues::RouteDetails::DestinationNameShortFi',
    'ChangeHistory::ChangedValues::RouteDetails::DestinationNameShortSv',

    'ChangeHistory::ChangedValues::RouteDetails::ValidityStart',
    'ChangeHistory::ChangedValues::RouteDetails::ValidityEnd',
    'ChangeHistory::ChangedValues::RouteDetails::Priority',

    'ChangeHistory::ChangedValues::RouteDetails::EstimatedLengthInMeters',
    'ChangeHistory::ChangedValues::RouteDetails::DrivingOrder',
    'ChangeHistory::ChangedValues::RouteDetails::TimingPoints',
    'ChangeHistory::ChangedValues::RouteDetails::RegulatedTimingPoints',
    'ChangeHistory::ChangedValues::RouteDetails::LoadingTimeAllowedOn',

    'ChangeHistory::ChangedValues::RouteDetails::ViaPoints',
    'ChangeHistory::ChangedValues::RouteDetails::ViaPointDetails::OpenButton',
    'ChangeHistory::ChangedValues::RouteDetails::ViaPointDetails::NameFi',
    'ChangeHistory::ChangedValues::RouteDetails::ViaPointDetails::NameSv',
    'ChangeHistory::ChangedValues::RouteDetails::ViaPointDetails::ShortNameFi',
    'ChangeHistory::ChangedValues::RouteDetails::ViaPointDetails::ShortNameSv',
    'ChangeHistory::ChangedValues::RouteDetails::ViaPointDetails::CloseButton',
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
      routeDetails: {
        ...base.changedValues.routeDetails,

        ...createPageObjectWithIdSelectors(
          'ChangeHistory::ChangedValues::RouteDetails',
          [
            'ChangeHistory::ChangedValues::RouteDetails::RouteLink',
            'ChangeHistory::ChangedValues::RouteDetails::ViaPoint',
            'ChangeHistory::ChangedValues::RouteDetails::TimingPoint',
          ],
        ),
      },
    },
    group: {
      ...BaseChangeHistoryTable.group,
      getAllGroupsByLineLabel(label: string) {
        return cy.get(`.group[data-line-label="${label}"]`);
      },
      getAllGroupsByRouteLabel(label: string) {
        return cy.get(`.group[data-route-label="${label}"]`);
      },
    },
  }),
);

export const LineChangeHistory = createSimplePageObject(
  'LineChangeHistory',
  [
    // StopChangeHistoryPage
    'LineChangeHistory::Container',

    // StopChangeHistoryPageTitleRow
    'LineChangeHistory::ReturnButton',
    'LineChangeHistory::Title',

    // StopChangeHistoryNames
    'LineChangeHistory::Names',
  ],
  (base) => ({
    ...BaseChangeHistoryPage,
    ...base,
    changeHistoryTable: LineChangeHistoryTable,
  }),
);
