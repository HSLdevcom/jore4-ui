import {
  GetInfrastructureLinksByExternalIdsResult,
  KnownValueKey,
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopAreaInput,
  StopInsertInput,
  StopRegistryNameType,
  StopRegistryTransportModeType,
  TerminalInput,
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  quayH2003,
  seedOrganisations,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  MapPage,
  Pagination,
  StopAreaChangeHistory,
  StopAreaDetailsPage,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';
import {
  changedBasicDetails,
  inputBasicDetails,
  setValidity,
  waitForSaveToBeFinished,
} from './stopAreaUtils';

const testInfraLinks = [
  {
    externalId: '7d29bd61-6cf7-4d2c-8bd8-b8e835fe90b7:1',
    coordinates: [24.92669962, 60.16418108, 10.09699999],
  },
];

const timingPlaces = [
  buildTimingPlace('352f8fd6-0eaa-4b01-a2db-734431092d62', '1AACKT'),
  buildTimingPlace('0388c3fb-a08b-461c-8655-581f06e9c2f5', '1AURLA'),
];

const buildScheduledStopPoints = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: 'H2003',
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '29dfb688-7ecc-4cb5-876d-c2c7f1a1f00a',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
];

const initialValidityStart = DateTime.fromISO('2000-01-01');
const initialValidityEnd = DateTime.fromISO('2052-01-01');

const stopAreaInput: StopAreaInput = {
  StopArea: {
    privateCode: { type: 'HSL/TEST', value: 'AreaA' },
    name: { lang: 'fin', value: 'Pohjoisesplanadi' },
    transportMode: StopRegistryTransportModeType.Tram,
    alternativeNames: [
      {
        name: { lang: 'swe', value: 'Norraesplanaden' },
        nameType: StopRegistryNameType.Translation,
      },
      {
        name: { lang: 'eng', value: 'North esplanade' },
        nameType: StopRegistryNameType.Translation,
      },
      {
        name: { lang: 'fin', value: 'Pohjoisesplanadi (pitkä)' },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'swe', value: 'Norraesplanaden (lång)' },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'eng', value: 'North esplanade (long)' },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'fin', value: 'Pohj.esplanadi' },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'swe', value: 'N.esplanaden' },
        nameType: StopRegistryNameType.Other,
      },

      {
        name: { lang: 'eng', value: 'N.esplanade' },
        nameType: StopRegistryNameType.Other,
      },
    ],
    keyValues: [
      {
        key: KnownValueKey.ValidityStart,
        values: [initialValidityStart.toISODate()],
      },
      {
        key: KnownValueKey.ValidityEnd,
        values: [initialValidityEnd.toISODate()],
      },
    ],
    geometry: quayH2003.quay.geometry,
    quays: [quayH2003.quay],
  },
  organisations: null,
};

const baseTerminalInput: TerminalInput = {
  terminal: getClonedBaseStopRegistryData().terminals[0].terminal,
  memberLabels: ['AreaA'],
};

function assertValueChanged([oldValue, newValue]: readonly [string, string]) {
  return () => {
    StopAreaChangeHistory.changeHistoryTable.changedValues
      .getOldValue()
      .shouldHaveText(oldValue);
    StopAreaChangeHistory.changeHistoryTable.changedValues
      .getNewValue()
      .shouldHaveText(newValue);
  };
}

function assertGroupValidityPeriod(
  index: number,
  start: DateTime,
  end: DateTime | null,
) {
  StopAreaChangeHistory.changeHistoryTable.group
    .getAllGroupElements()
    .eq(index)
    .within(() => {
      StopAreaChangeHistory.changeHistoryTable.sectionHeader
        .getValidityStart()
        .shouldHaveText(start.toFormat('d.L.yyyy'));

      if (end) {
        StopAreaChangeHistory.changeHistoryTable.sectionHeader
          .getValidityEnd()
          .shouldHaveText(end.toFormat('d.L.yyyy'));
      } else {
        StopAreaChangeHistory.changeHistoryTable.sectionHeader
          .getValidityEnd()
          .shouldHaveText('-');
      }
    });
}

const tags = [Tag.StopRegistry, Tag.ChangeHistory];
describe('Stop Change History', { tags }, () => {
  let dbResources: SupportedResources &
    Required<Pick<SupportedResources, 'stops'>>;

  before(() => {
    cy.task<GetInfrastructureLinksByExternalIdsResult>(
      'hasuraAPI',
      mapToGetInfrastructureLinksByExternalIdsQuery(
        testInfraLinks.map((infralink) => infralink.externalId),
      ),
    ).then((res) => {
      const infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);

      const stops = buildScheduledStopPoints(infraLinkIds);
      dbResources = {
        timingPlaces,
        stops,
      };
    });
  });

  function initTestData(withTerminal: boolean = false) {
    cy.task('resetDbs');

    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: [stopAreaInput],
      organisations: seedOrganisations,
      ...(withTerminal ? { terminals: [baseTerminalInput] } : {}),
    });

    cy.setupTests();
    cy.mockLogin();
  }

  it('Should diff basic Stop Area details', () => {
    initTestData();

    StopAreaDetailsPage.visit('AreaA');

    cy.section('Make changes', () => {
      StopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(changedBasicDetails);
      StopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    StopAreaDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      const { stopAreaDetails } =
        StopAreaChangeHistory.changeHistoryTable.changedValues;

      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          stopAreaDetails
            .getNameFin()
            .within(
              assertValueChanged([
                'Pohjoisesplanadi',
                changedBasicDetails.name,
              ]),
            );
          stopAreaDetails
            .getNameSwe()
            .within(
              assertValueChanged([
                'Norraesplanaden',
                changedBasicDetails.nameSwe,
              ]),
            );
          stopAreaDetails
            .getNameEng()
            .within(
              assertValueChanged([
                'North esplanade',
                changedBasicDetails.nameEng,
              ]),
            );

          stopAreaDetails
            .getLongNameFin()
            .within(
              assertValueChanged([
                'Pohjoisesplanadi (pitkä)',
                changedBasicDetails.nameLongFin,
              ]),
            );
          stopAreaDetails
            .getLongNameSwe()
            .within(
              assertValueChanged([
                'Norraesplanaden (lång)',
                changedBasicDetails.nameLongSwe,
              ]),
            );
          stopAreaDetails
            .getLongNameEng()
            .within(
              assertValueChanged([
                'North esplanade (long)',
                changedBasicDetails.nameLongEng,
              ]),
            );

          stopAreaDetails
            .getAbbreviationFin()
            .within(
              assertValueChanged([
                'Pohj.esplanadi',
                changedBasicDetails.abbreviationFin,
              ]),
            );
          stopAreaDetails
            .getAbbreviationSwe()
            .within(
              assertValueChanged([
                'N.esplanaden',
                changedBasicDetails.abbreviationSwe,
              ]),
            );
          stopAreaDetails
            .getAbbreviationEng()
            .within(
              assertValueChanged([
                'N.esplanade',
                changedBasicDetails.abbreviationEng,
              ]),
            );

          stopAreaDetails
            .getValidityStart()
            .within(
              assertValueChanged([
                '1.1.2000',
                changedBasicDetails.validFrom.toFormat('d.L.yyyy'),
              ]),
            );
          stopAreaDetails
            .getValidityEnd()
            .within(assertValueChanged(['1.1.2052', '-']));
        });
    });
  });

  it('Should diff list of stops', () => {
    initTestData();

    MapPage.map.visit({
      zoom: 16,
      lat: 60.164074274478054,
      lng: 24.93021804533524,
    });

    cy.section('Add a new stop onto the area', () => {
      MapPage.createStopAtLocation({
        stopFormInfo: {
          publicCode: 'T1234',
          stopPlace: 'AreaA',
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
          reasonForChange: 'Initial creation',
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
        vehicleMode: ReusableComponentsVehicleModeEnum.Tram,
      });

      MapPage.gqlStopShouldBeCreatedSuccessfully();
      MapPage.checkStopSubmitSuccessToast();
    });

    StopAreaDetailsPage.visit('AreaA');
    StopAreaDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          StopAreaChangeHistory.changeHistoryTable.changedValues.stopAreaStops
            .getStops()
            .within(assertValueChanged(['H2003', ['H2003', 'T1234'].join('')]));
        });
    });
  });

  it('Should diff terminal', () => {
    initTestData(true);

    // Base data insert conveniently triggers an "added to a new terminal"
    // change to be generated.
    cy.visit('/stop-registry/stop-areas/AreaA/history');

    StopAreaChangeHistory.changeHistoryTable.group
      .getAllGroupElements()
      .eq(1) // Group 0 contains some update the associated quay.
      .within(() => {
        StopAreaChangeHistory.changeHistoryTable.changedValues.stopAreaTerminal
          .getParentTerminal()
          .within(assertValueChanged(['-', 'T2: E2ET001']));
      });
  });

  it('Should filter and page items', () => {
    initTestData();

    StopAreaDetailsPage.visit('AreaA');

    cy.section('Make changes to Finnish name', () => {
      StopAreaDetailsPage.details.getEditButton().click();
      StopAreaDetailsPage.details.edit
        .getName()
        .clearAndType(changedBasicDetails.name);
      StopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    cy.section('Check paging', () => {
      cy.visit('/stop-registry/stop-areas/AreaA/history?pageSize=1');

      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .should('have.length', 1);
      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          StopAreaChangeHistory.changeHistoryTable.changedValues.stopAreaDetails
            .getNameFin()
            .within(() => {
              StopAreaChangeHistory.changeHistoryTable.changedValues
                .getNewValue()
                .shouldHaveText(changedBasicDetails.name);
            });
        });

      Pagination.getPageButton(3).should('not.exist');
      Pagination.getPageButton(2).shouldBeVisible().click();

      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .should('have.length', 1);
      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() =>
          StopAreaChangeHistory.changeHistoryTable.sectionHeader
            .getCreatedAreaVersion()
            .shouldBeVisible(),
        );
    });

    cy.section('Check filtering', () => {
      cy.visit('/stop-registry/stop-areas/AreaA/history?pageSize=10');

      StopAreaChangeHistory.dateFilter
        .getToDate()
        .focus()
        .inputDateValue(DateTime.now().minus({ months: 1 }));

      StopAreaChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .should('have.length', 0);
    });
  });

  it('Should sort items', () => {
    initTestData();

    StopAreaDetailsPage.visit('AreaA');

    const start = DateTime.local(2026, 1, 1);
    const mid = DateTime.local(2026, 6, 15);
    const end = DateTime.local(2026, 10, 31);

    cy.section('Make changes to validity period', () => {
      StopAreaDetailsPage.details.getEditButton().click();
      setValidity(start, mid);
      StopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();

      StopAreaDetailsPage.details.getEditButton().click();
      setValidity(mid, end);
      StopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    StopAreaDetailsPage.versioningRow.getChangeHistoryLink().click();
    StopAreaChangeHistory.changeHistoryTable.group
      .getAllGroupElements()
      .should('have.length', 3);

    cy.section('Check sorting by change time - Descending (default)', () => {
      StopAreaChangeHistory.changeHistoryTable.sortByButton
        .getChanged()
        .should('have.attr', 'data-is-active', 'true')
        .and('have.attr', 'data-sort-direction', 'desc');

      assertGroupValidityPeriod(0, mid, end);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, initialValidityStart, initialValidityEnd);
    });

    cy.section('Check sorting by change time - Ascending', () => {
      StopAreaChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'Changed',
        'asc',
      );

      assertGroupValidityPeriod(0, initialValidityStart, initialValidityEnd);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, mid, end);
    });

    cy.section('Check sorting by validity start - Ascending', () => {
      StopAreaChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityStart',
        'asc',
      );

      assertGroupValidityPeriod(0, initialValidityStart, initialValidityEnd);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, mid, end);
    });

    cy.section('Check sorting by validity start - Descending', () => {
      StopAreaChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityStart',
        'desc',
      );

      assertGroupValidityPeriod(0, mid, end);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, initialValidityStart, initialValidityEnd);
    });

    cy.section('Check sorting by validity End - Ascending', () => {
      StopAreaChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityEnd',
        'asc',
      );

      assertGroupValidityPeriod(0, start, mid);
      assertGroupValidityPeriod(1, mid, end);
      assertGroupValidityPeriod(2, initialValidityStart, initialValidityEnd);
    });

    cy.section('Check sorting by validity End - Descending', () => {
      StopAreaChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityEnd',
        'desc',
      );

      assertGroupValidityPeriod(0, initialValidityStart, initialValidityEnd);
      assertGroupValidityPeriod(1, mid, end);
      assertGroupValidityPeriod(2, start, mid);
    });
  });
});
