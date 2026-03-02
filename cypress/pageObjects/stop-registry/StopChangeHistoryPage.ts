import {
  createPageObjectWithIdSelectors,
  createSimplePageObject,
} from '../createSimplePageObject';

const StopChangeHistoryTableShelterChangedValues =
  createPageObjectWithIdSelectors(
    'ChangeHistory::ChangedValues::ShelterDetails',
    [
      'ChangeHistory::ChangedValues::ShelterDetails::Added',
      'ChangeHistory::ChangedValues::ShelterDetails::Updated',
      'ChangeHistory::ChangedValues::ShelterDetails::Removed',

      'ChangeHistory::ChangedValues::ShelterDetails::ShelterNumber',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterExternalId',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterType',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterElectricity',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterLighting',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterCondition',
      'ChangeHistory::ChangedValues::ShelterDetails::TimetableCabinets',
      'ChangeHistory::ChangedValues::ShelterDetails::TrashCan',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterHasDisplay',
      'ChangeHistory::ChangedValues::ShelterDetails::BicycleParking',
      'ChangeHistory::ChangedValues::ShelterDetails::LeaningRail',
      'ChangeHistory::ChangedValues::ShelterDetails::OutsideBench',
      'ChangeHistory::ChangedValues::ShelterDetails::ShelterFasciaBoardTaping',
    ],
  );

const StopChangeHistoryTableInfoSpotChangedValues =
  createPageObjectWithIdSelectors(
    'ChangeHistory::ChangedValues::InfoSpotDetails',
    [
      'ChangeHistory::ChangedValues::InfoSpotDetails::Label',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Purpose',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Size',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Backlight',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Latitude',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Longitude',
      'ChangeHistory::ChangedValues::InfoSpotDetails::ZoneLabel',
      'ChangeHistory::ChangedValues::InfoSpotDetails::RailInformation',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Floor',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Description',
      'ChangeHistory::ChangedValues::InfoSpotDetails::Posters',
    ],
  );

const ChangeHistoryTable = createSimplePageObject(
  'ChangeHistory',
  [
    // Shared generic component getters
    // ChangeHistoryTable
    'ChangeHistory::Table',
    'ChangeHistory::Heading::Name',
    'ChangeHistory::Heading::OldValue',
    'ChangeHistory::Heading::NewValue',
    'ChangeHistory::Heading::ValidityStart',
    'ChangeHistory::Heading::ValidityEnd',
    'ChangeHistory::Heading::ValidityCombined',
    'ChangeHistory::Heading::Changed',
    'ChangeHistory::Heading::ChangedBy',
    'ChangeHistory::Heading::ChangedCombined',

    // SortByButton(s)
    'ChangeHistory::SortByButton::ValidityStart',
    'ChangeHistory::SortByButton::ValidityEnd',
    'ChangeHistory::SortByButton::Changed',
    'ChangeHistory::SortByButton::ChangedBy',

    // ChangeHistoryItemSectionHeaderRow
    'ChangeHistory::SectionHeader::Title',
    'ChangeHistory::SectionHeader::ValidityStart',
    'ChangeHistory::SectionHeader::ValidityEnd',
    'ChangeHistory::SectionHeader::ValidityCombined',
    'ChangeHistory::SectionHeader::ChangedBy',
    'ChangeHistory::SectionHeader::Changed',
    'ChangeHistory::SectionHeader::ChangedCombined',

    // ChangedValueRow
    'ChangeHistory::ChangedValues::Name',
    'ChangeHistory::ChangedValues::OldValue',
    'ChangeHistory::ChangedValues::NewValue',

    // Stop Change history table getters
    // StopChangeHistoryItem | NoPreviousChangeVersionSection
    'ChangeHistory::SectionHeader::InvalidVersion',
    'ChangeHistory::SectionHeader::ImportedVersion',
    'ChangeHistory::SectionHeader::CreatedVersion',
    'ChangeHistory::SectionHeader::CopiedVersion',

    // DataDiffSections | Header & Value rows | StopPlaceDetails
    'ChangeHistory::SectionHeader::StopPlaceDetails',
    'ChangeHistory::ChangedValues::StopPlaceDetails::StopAreaNameFin',
    'ChangeHistory::ChangedValues::StopPlaceDetails::StopAreaNameSwe',
    'ChangeHistory::ChangedValues::StopPlaceDetails::TerminalNameFin',

    // DataDiffSections | Header & Value rows | BasicDetails
    'ChangeHistory::SectionHeader::BasicDetails',
    'ChangeHistory::ChangedValues::BasicDetails::PublicCode',
    'ChangeHistory::ChangedValues::BasicDetails::PrivateCode',
    'ChangeHistory::ChangedValues::BasicDetails::LocationFin',
    'ChangeHistory::ChangedValues::BasicDetails::LocationSwe',
    'ChangeHistory::ChangedValues::BasicDetails::StopState',
    'ChangeHistory::ChangedValues::BasicDetails::TransportMode',
    'ChangeHistory::ChangedValues::BasicDetails::ElyNumber',
    'ChangeHistory::ChangedValues::BasicDetails::TimingPlaceId',
    'ChangeHistory::ChangedValues::BasicDetails::RailReplacement',
    'ChangeHistory::ChangedValues::BasicDetails::Virtual',

    // DataDiffSections | Header & Value rows | LocationDetails
    'ChangeHistory::SectionHeader::LocationDetails',
    'ChangeHistory::ChangedValues::LocationDetails::StreetAddress',
    'ChangeHistory::ChangedValues::LocationDetails::PostalCode',
    'ChangeHistory::ChangedValues::LocationDetails::Municipality',
    'ChangeHistory::ChangedValues::LocationDetails::FareZone',
    'ChangeHistory::ChangedValues::LocationDetails::Latitude',
    'ChangeHistory::ChangedValues::LocationDetails::Longitude',
    'ChangeHistory::ChangedValues::LocationDetails::Altitude',
    'ChangeHistory::ChangedValues::LocationDetails::FunctionalArea',
    'ChangeHistory::ChangedValues::LocationDetails::PlatformNumber',
    'ChangeHistory::ChangedValues::LocationDetails::SignContentType',

    // DataDiffSections | Header & Value rows | SignDetails
    'ChangeHistory::SectionHeader::SignDetails',
    'ChangeHistory::ChangedValues::SignDetails::SignType',
    'ChangeHistory::ChangedValues::SignDetails::NumberOfFrames',
    'ChangeHistory::ChangedValues::SignDetails::SignageInstructionExceptions',
    'ChangeHistory::ChangedValues::SignDetails::ReplacesRailSign',

    // DataDiffSections | Header & Value rows | MeasurementDetails
    'ChangeHistory::SectionHeader::MeasurementDetails',
    'ChangeHistory::ChangedValues::MeasurementDetails::StopType',
    'ChangeHistory::ChangedValues::MeasurementDetails::CurvedStop',
    'ChangeHistory::ChangedValues::MeasurementDetails::ShelterType',
    'ChangeHistory::ChangedValues::MeasurementDetails::ShelterLaneDistance',
    'ChangeHistory::ChangedValues::MeasurementDetails::CurbBackOfRailDistance',
    'ChangeHistory::ChangedValues::MeasurementDetails::StopAreaSideSlope',
    'ChangeHistory::ChangedValues::MeasurementDetails::StopAreaLengthwiseSlope',
    'ChangeHistory::ChangedValues::MeasurementDetails::StructureLaneDistance',
    'ChangeHistory::ChangedValues::MeasurementDetails::StopElevationFromRailTop',
    'ChangeHistory::ChangedValues::MeasurementDetails::StopElevationFromSidewalk',
    'ChangeHistory::ChangedValues::MeasurementDetails::LowerCleatHeight',
    'ChangeHistory::ChangedValues::MeasurementDetails::PlatformEdgeWarningArea',
    'ChangeHistory::ChangedValues::MeasurementDetails::SidewalkAccessibleConnection',
    'ChangeHistory::ChangedValues::MeasurementDetails::GuidanceStripe',
    'ChangeHistory::ChangedValues::MeasurementDetails::ServiceAreaStripes',
    'ChangeHistory::ChangedValues::MeasurementDetails::GuidanceType',
    'ChangeHistory::ChangedValues::MeasurementDetails::GuidanceTiles',
    'ChangeHistory::ChangedValues::MeasurementDetails::MapType',
    'ChangeHistory::ChangedValues::MeasurementDetails::CurbDriveSideOfRailDistance',
    'ChangeHistory::ChangedValues::MeasurementDetails::EndRampSlope',
    'ChangeHistory::ChangedValues::MeasurementDetails::ServiceAreaWidth',
    'ChangeHistory::ChangedValues::MeasurementDetails::ServiceAreaLength',
    'ChangeHistory::ChangedValues::MeasurementDetails::PedestrianCrossingRampType',
    'ChangeHistory::ChangedValues::MeasurementDetails::StopAreaSurroundingsAccessible',

    // DataDiffSections | Header & Value rows | MaintenanceDetails
    'ChangeHistory::SectionHeader::MaintenanceDetails',
    'ChangeHistory::ChangedValues::MaintenanceDetails::StopOwner',
    'ChangeHistory::ChangedValues::MaintenanceDetails::ShelterMaintenance',
    'ChangeHistory::ChangedValues::MaintenanceDetails::Maintenance',
    'ChangeHistory::ChangedValues::MaintenanceDetails::WinterMaintenance',
    'ChangeHistory::ChangedValues::MaintenanceDetails::InfoUpkeep',
    'ChangeHistory::ChangedValues::MaintenanceDetails::Cleaning',

    // DataDiffSections | ShelterDetails & InfoSpotDetails | Heders.
    // ChangedValue sections need more complex logic.
    'ChangeHistory::SectionHeader::ShelterDetails',
    'ChangeHistory::SectionHeader::InfoSpotDetails',
  ],
  (base) => ({
    ...base,
    sectionHeader: {
      ...base.sectionHeader,
      getAll: () => cy.get('tr[data-testid^="ChangeHistory::SectionHeader::"]'),
    },
    changedValues: {
      ...base.changedValues,
      shelterDetails: StopChangeHistoryTableShelterChangedValues,
      infoSpotDetails: StopChangeHistoryTableInfoSpotChangedValues,
    },
    group: {
      getAllGroupElements: () =>
        cy.get('[data-testid^="ChangeHistory::Group::"]'),
      getGroup: (id: string) => cy.getByTestId(`ChangeHistory::Group::${id}`),
    },
  }),
);

export const StopChangeHistoryPage = createSimplePageObject(
  'StopChangeHistoryPage',
  [
    // StopChangeHistoryPage
    'StopChangeHistoryPage::Container',

    // StopChangeHistoryPageTitleRow
    'StopChangeHistoryPage::ReturnButton',
    'StopChangeHistoryPage::Title',

    // StopChangeHistoryNames
    'StopChangeHistoryPage::Names',

    // DateRangeFilter
    'StopChangeHistoryPage::DateFilter::FromDate',
    'StopChangeHistoryPage::DateFilter::ToDate',

    // FailedToLoadStopChangeHistory
    'StopChangeHistoryPage::FailedToLoad',
    'StopChangeHistoryPage::RetryButton',

    // LoadingStopChangeHistory
    'StopChangeHistoryPage::Loading',
  ],
  (base) => ({
    ...base,
    changeHistoryTable: ChangeHistoryTable,
  }),
);
