import {
  GetInfrastructureLinksByExternalIdsResult,
  KnownValueKey,
  StopAreaInput,
  StopInsertInput,
  StopRegistryTransportModeType,
  TerminalInput,
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  quayH2003,
  quayV1562,
  seedOrganisations,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  ExternalLinksForm,
  ExternalLinksSection,
  Pagination,
  TerminalChangeHistory,
  TerminalDetailsPage,
  TerminalInfoSpotRow,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';
import { InfoSpotData, assertInfoSpot } from './infoSpotUtils';
import {
  changedBasicDetails,
  changedLocationDetails,
  inputBasicDetails,
  inputLocationDetails,
  waitForSaveToBeFinished,
  waitForValidityEditToBeFinished,
} from './terminalUtils';

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
  {
    ...buildStop({
      label: 'V1562',
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: 'e3528755-711f-4e2e-832c-eb2becf6b953',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
];

const initialValidityStart = DateTime.fromISO('2020-01-01');
const initialValidityEnd = DateTime.fromISO('2050-01-01');

const stopAreaInputs: StopAreaInput[] = [
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'AreaA' },
      name: { lang: 'fin', value: 'Pohjoisesplanadi' },
      transportMode: StopRegistryTransportModeType.Bus,
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
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'AreaB' },
      name: { lang: 'fin', value: 'Testiarea' },
      transportMode: StopRegistryTransportModeType.Bus,
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
      geometry: quayV1562.quay.geometry,
      quays: [quayV1562.quay],
    },
    organisations: null,
  },
];

const baseTerminalInput: TerminalInput = {
  terminal: getClonedBaseStopRegistryData().terminals[0].terminal,
  memberLabels: ['AreaA'],
};

function assertValueChanged([oldValue, newValue]: readonly [string, string]) {
  return () => {
    TerminalChangeHistory.changeHistoryTable.changedValues
      .getOldValue()
      .shouldHaveText(oldValue);
    TerminalChangeHistory.changeHistoryTable.changedValues
      .getNewValue()
      .shouldHaveText(newValue);
  };
}

function assertGroupValidityPeriod(
  index: number,
  start: DateTime,
  end: DateTime | null,
) {
  TerminalChangeHistory.changeHistoryTable.group
    .getAllGroupElements()
    .eq(index)
    .within(() => {
      TerminalChangeHistory.changeHistoryTable.sectionHeader
        .getValidityStart()
        .shouldHaveText(start.toFormat('d.L.yyyy'));

      if (end) {
        TerminalChangeHistory.changeHistoryTable.sectionHeader
          .getValidityEnd()
          .shouldHaveText(end.toFormat('d.L.yyyy'));
      } else {
        TerminalChangeHistory.changeHistoryTable.sectionHeader
          .getValidityEnd()
          .shouldHaveText('-');
      }
    });
}

const tags = [Tag.StopRegistry, Tag.ChangeHistory];
describe('Terminal Change History', { tags }, () => {
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

  function initTestData() {
    cy.task('resetDbs');

    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: stopAreaInputs,
      terminals: [baseTerminalInput],
      organisations: seedOrganisations,
    });

    cy.setupTests();
    cy.mockLogin();
  }

  it('Should diff basic Terminal details', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    cy.section('Make changes', () => {
      TerminalDetailsPage.terminalDetails.getEditButton().click();
      inputBasicDetails(changedBasicDetails);
      TerminalDetailsPage.terminalDetails.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      const { terminalDetails } =
        TerminalChangeHistory.changeHistoryTable.changedValues;

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          terminalDetails
            .getDescription()
            .within(
              assertValueChanged([
                'E2E testiterminaali',
                changedBasicDetails.description,
              ]),
            );
          terminalDetails
            .getNameFin()
            .within(assertValueChanged(['E2ET001', changedBasicDetails.name]));
          terminalDetails
            .getNameSwe()
            .within(
              assertValueChanged(['Terminalen', changedBasicDetails.nameSwe]),
            );
          terminalDetails
            .getNameEng()
            .within(
              assertValueChanged(['Terminal', changedBasicDetails.nameEng]),
            );

          terminalDetails
            .getLongNameFin()
            .within(
              assertValueChanged([
                'Terminaali pitkänimi',
                changedBasicDetails.nameLongFin,
              ]),
            );
          terminalDetails
            .getLongNameSwe()
            .within(
              assertValueChanged([
                'Terminalen långnamn',
                changedBasicDetails.nameLongSwe,
              ]),
            );
          terminalDetails
            .getLongNameEng()
            .within(
              assertValueChanged([
                'Terminal long name',
                changedBasicDetails.nameLongEng,
              ]),
            );

          terminalDetails
            .getAbbreviationFin()
            .within(
              assertValueChanged([
                'Terminaali',
                changedBasicDetails.abbreviationFin,
              ]),
            );
          terminalDetails
            .getAbbreviationSwe()
            .within(
              assertValueChanged([
                'Terminalen',
                changedBasicDetails.abbreviationSwe,
              ]),
            );
          terminalDetails
            .getAbbreviationEng()
            .within(
              assertValueChanged([
                'Terminal',
                changedBasicDetails.abbreviationEng,
              ]),
            );

          terminalDetails
            .getTerminalType()
            .within(
              assertValueChanged(['Bussiterminaali', 'Ratikkaterminaali']),
            );

          terminalDetails
            .getDeparturePlatforms()
            .within(
              assertValueChanged(['7', changedBasicDetails.departurePlatforms]),
            );
          terminalDetails
            .getArrivalPlatforms()
            .within(
              assertValueChanged(['6', changedBasicDetails.arrivalPlatforms]),
            );
          terminalDetails
            .getLoadingPlatforms()
            .within(
              assertValueChanged(['3', changedBasicDetails.loadingPlatforms]),
            );
          terminalDetails
            .getElectricCharging()
            .within(
              assertValueChanged(['2', changedBasicDetails.electricCharging]),
            );
        });
    });
  });

  it('Should diff location details', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    cy.section('Make changes', () => {
      TerminalDetailsPage.locationDetails.getEditButton().click();
      inputLocationDetails(changedLocationDetails);
      const { edit } = TerminalDetailsPage.locationDetails;

      edit.getSelectMemberStops().within(() => {
        cy.getByTestId('SelectMemberStopsDropdownButton').click();
        cy.getByTestId('BaseSelectMemberStopsDropdown::input').clearAndType(
          'V1562',
        );
      });

      cy.getByTestId('MemberStopOptions::option').contains('V1562').click();
      cy.closeDropdown();
      TerminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      const { terminalDetails } =
        TerminalChangeHistory.changeHistoryTable.changedValues;

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          TerminalChangeHistory.changeHistoryTable.changedValues.terminalStops
            .getStops()
            .within(assertValueChanged(['H2003', 'H2003, V1562']));
        });

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(1)
        .within(() => {
          terminalDetails
            .getStreetAddress()
            .within(
              assertValueChanged([
                'Mannerheimintie 22-24',
                changedLocationDetails.streetAddress,
              ]),
            );
          terminalDetails
            .getPostalCode()
            .within(
              assertValueChanged(['00100', changedLocationDetails.postalCode]),
            );
        });
    });
  });

  it('Should diff owner details', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    cy.section('Make changes to owner', () => {
      const {
        owner,
        owner: {
          edit,
          edit: { ownerModal },
        },
      } = TerminalDetailsPage;

      // Start editing owner
      owner.getEditButton().click();

      // Add a new owner
      edit.getOwnerDropdownButton().click();
      edit.getOwnerDropdownOptions().contains('Lisää uusi toimija').click();
      ownerModal.form.getName().clearAndType('Uusi omistaja');
      ownerModal.form.getPhone().clearAndType('0401234567');
      ownerModal.form.getEmail().clearAndType('uusi.omistaja@example.com');
      ownerModal.form.getSaveButton().click();

      // Change the other fields too
      edit.getContractId().clearAndType('NEW-CONTRACT-123');
      edit.getNote().clearAndType('Uudet sopimuksen ehdot');

      // Save
      owner.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      const { ownerDetails } =
        TerminalChangeHistory.changeHistoryTable.changedValues;

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          ownerDetails
            .getOwnerName()
            .within(assertValueChanged(['-', 'Uusi omistaja']));
          ownerDetails
            .getOwnerContractId()
            .within(assertValueChanged(['-', 'NEW-CONTRACT-123']));
          ownerDetails
            .getOwnerNote()
            .within(assertValueChanged(['-', 'Uudet sopimuksen ehdot']));
        });
    });
  });

  it('Should diff member stops', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    cy.section('Add member stop', () => {
      TerminalDetailsPage.getTabSelector().getStopsTab().click();

      TerminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
      TerminalDetailsPage.stopsPage.addStopsModal.getModal().shouldBeVisible();

      TerminalDetailsPage.stopsPage.addStopsModal.dropdown
        .dropdownButton()
        .click();
      TerminalDetailsPage.stopsPage.addStopsModal.dropdown
        .getInput()
        .type('V1562', { force: true });

      TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
        .getMemberOptions()
        .eq(0)
        .should('contain.text', 'V1562')
        .click();

      TerminalDetailsPage.stopsPage.addStopsModal.dropdown
        .dropdownButton()
        .click();

      TerminalDetailsPage.stopsPage.addStopsModal.getSaveButton().click();

      TerminalDetailsPage.stopsPage.getStopAreas().should('have.length', 2);
    });

    TerminalDetailsPage.getTabSelector().getBasicDetailsTab().click();
    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          TerminalChangeHistory.changeHistoryTable.changedValues.terminalStops
            .getStops()
            .within(assertValueChanged(['H2003', 'H2003, V1562']));
        });
    });
  });

  it('Should diff external links', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    cy.section('Add external link', () => {
      ExternalLinksSection.getEditButton().click();
      ExternalLinksForm.getAddNewButton().click();
      ExternalLinksForm.getNthExternalLink(1).within(() => {
        ExternalLinksForm.externalLinks
          .getNameInput()
          .clearAndType('Test Link');
        ExternalLinksForm.externalLinks
          .getLocationInput()
          .clearAndType('http://www.example.com');
      });
      ExternalLinksForm.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          TerminalChangeHistory.changeHistoryTable.sectionHeader
            .getTerminalExternalLinks()
            .shouldBeVisible();
          TerminalChangeHistory.changeHistoryTable.changedValues.terminalExternalLinks
            .getLinks()
            .within(() => {
              TerminalChangeHistory.changeHistoryTable.changedValues
                .getOldValue()
                .should('contain.text', 'Terminaalin Testilinkki')
                .and('contain.text', '(https://terminaltest.fi)');
              TerminalChangeHistory.changeHistoryTable.changedValues
                .getNewValue()
                .should('contain.text', 'Terminaalin Testilinkki')
                .and('contain.text', '(https://terminaltest.fi)')
                .and('contain.text', 'Test Link')
                .and('contain.text', '(http://www.example.com)');
            });
        });
    });
  });

  const changedInfoSpot = {
    addedFirstInfoSpot: {
      label: ['', 'Test Label'],
      purpose: ['', 'Pysäkkijuliste'],
      size: ['', 'A3 (29.7 × 42.0 cm)'],
    },
    updatedInfoSpot: {
      label: ['Test Label', 'Updated Label'],
      purpose: ['Pysäkkijuliste', 'Kartta'],
      size: ['A3 (29.7 × 42.0 cm)', '100 × 140 cm'],
      backlight: ['-', 'Kyllä'],
      floor: ['-', '2'],
      railInformation: ['-', 'Track 2'],
      zoneLabel: ['Ei tiedossa', 'Kyllä'],
    },
    removedInfoSpot: {
      label: ['Updated Label', ''],
      purpose: ['Kartta', ''],
      size: ['100 × 140 cm', ''],
      backlight: ['Kyllä', ''],
      floor: ['2', ''],
      railInformation: ['Track 2', ''],
    },
  } as const satisfies Readonly<Record<string, InfoSpotData>>;

  it('Should diff Info Spot Details', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');
    TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

    cy.section('Add info spot', () => {
      TerminalDetailsPage.infoSpots.getAddNewButton().click();

      TerminalDetailsPage.infoSpots.form.getNthInfoSpot(0).within(() => {
        TerminalDetailsPage.infoSpots.form.formFields
          .getLabel()
          .clearAndType(changedInfoSpot.addedFirstInfoSpot.label[1]);

        TerminalDetailsPage.infoSpots.form.formFields
          .getPurposeButton()
          .click();
        cy.withinHeadlessPortal(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getPurposeOptions()
            .contains(changedInfoSpot.addedFirstInfoSpot.purpose[1])
            .click(),
        );

        TerminalDetailsPage.infoSpots.form.formFields
          .getSizeSelectorButton()
          .click();
        cy.withinHeadlessPortal(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getSizeSelectorOptions()
            .contains(changedInfoSpot.addedFirstInfoSpot.size[1])
            .click(),
        );
      });

      TerminalDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Terminaali muokattu');
    });

    cy.section('Update info spot', () => {
      TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
      TerminalInfoSpotRow.getEditButton().click();
      TerminalDetailsPage.infoSpots.form.getNthInfoSpot(0).within(() => {
        TerminalDetailsPage.infoSpots.form.formFields
          .getLabel()
          .clearAndType(changedInfoSpot.updatedInfoSpot.label[1]);

        TerminalDetailsPage.infoSpots.form.formFields
          .getPurposeButton()
          .click();
        cy.withinHeadlessPortal(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getPurposeOptions()
            .contains(changedInfoSpot.updatedInfoSpot.purpose[1])
            .click(),
        );

        TerminalDetailsPage.infoSpots.form.formFields
          .getSizeSelectorButton()
          .click();
        cy.withinHeadlessPortal(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getSizeSelectorOptions()
            .contains('Syötä mitat')
            .click(),
        );
        TerminalDetailsPage.infoSpots.form.formFields
          .getSizeWidth()
          .clearAndType('1000');
        TerminalDetailsPage.infoSpots.form.formFields
          .getSizeHeight()
          .clearAndType('1400');

        TerminalDetailsPage.infoSpots.form.formFields
          .getBacklightButton()
          .click();
        cy.withinHeadlessPortal(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getBacklightOptions()
            .contains(changedInfoSpot.updatedInfoSpot.backlight[1])
            .click(),
        );

        TerminalDetailsPage.infoSpots.form.formFields
          .getFloor()
          .clearAndType(changedInfoSpot.updatedInfoSpot.floor[1]);

        TerminalDetailsPage.infoSpots.form.formFields
          .getRailInformation()
          .clearAndType(changedInfoSpot.updatedInfoSpot.railInformation[1]);

        TerminalDetailsPage.infoSpots.form.formFields
          .getZoneLabelButton()
          .click();
        cy.withinHeadlessPortal(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getZoneLabelOptions()
            .contains(changedInfoSpot.updatedInfoSpot.zoneLabel[1])
            .click(),
        );
      });

      TerminalInfoSpotRow.getSaveButton().click();
      Toast.expectSuccessToast('Terminaali muokattu');
    });

    cy.section('Remove info spot', () => {
      TerminalInfoSpotRow.getEditButton().click();

      TerminalDetailsPage.infoSpots.form
        .getNthInfoSpot(0)
        .within(() =>
          TerminalDetailsPage.infoSpots.form.formFields
            .getDeleteInfoSpotButton()
            .click(),
        );

      TerminalInfoSpotRow.getSaveButton().click();
      Toast.expectSuccessToast('Terminaali muokattu');
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    const {
      sectionHeader,
      changedValues: { infoSpotDetails },
    } = TerminalChangeHistory.changeHistoryTable;

    cy.section('Check removed info spot history', () => {
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() =>
          assertInfoSpot(
            sectionHeader,
            infoSpotDetails,
            () =>
              infoSpotDetails
                .getAllRemovedElements()
                .should('have.length', 1)
                .within(assertValueChanged(['Poistettu infopaikka', ''])),
            assertValueChanged(changedInfoSpot.removedInfoSpot.label),
            assertValueChanged,
            changedInfoSpot.removedInfoSpot,
          ),
        );
    });

    cy.section('Check updated info spot history', () => {
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(1)
        .within(() => {
          sectionHeader
            .getInfoSpotDetails()
            .within(() => sectionHeader.getTitle().contains('Infopaikat'));

          infoSpotDetails
            .getAllUpdatedElements()
            .should('have.length', 1)
            .within(assertValueChanged(['Päivitetty infopaikka', '']));

          infoSpotDetails
            .getLabel()
            .within(assertValueChanged(changedInfoSpot.updatedInfoSpot.label));

          infoSpotDetails
            .getPurpose()
            .within(
              assertValueChanged(changedInfoSpot.updatedInfoSpot.purpose),
            );

          infoSpotDetails
            .getSize()
            .within(assertValueChanged(changedInfoSpot.updatedInfoSpot.size));

          infoSpotDetails
            .getBacklight()
            .within(
              assertValueChanged(changedInfoSpot.updatedInfoSpot.backlight),
            );

          infoSpotDetails
            .getFloor()
            .within(assertValueChanged(changedInfoSpot.updatedInfoSpot.floor));

          infoSpotDetails
            .getRailInformation()
            .within(
              assertValueChanged(
                changedInfoSpot.updatedInfoSpot.railInformation,
              ),
            );

          infoSpotDetails
            .getZoneLabel()
            .within(
              assertValueChanged(changedInfoSpot.updatedInfoSpot.zoneLabel),
            );
        });
    });

    cy.section('Check added info spot history', () => {
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(2)
        .within(() => {
          infoSpotDetails
            .getAllAddedElements()
            .should('have.length', 1)
            .within(assertValueChanged(['', 'Uusi infopaikka']));

          infoSpotDetails
            .getLabel()
            .within(
              assertValueChanged(changedInfoSpot.addedFirstInfoSpot.label),
            );

          infoSpotDetails
            .getPurpose()
            .within(
              assertValueChanged(changedInfoSpot.addedFirstInfoSpot.purpose),
            );

          infoSpotDetails
            .getSize()
            .within(
              assertValueChanged(changedInfoSpot.addedFirstInfoSpot.size),
            );
        });
    });
  });

  it('Should diff validity period', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    const newStart = DateTime.local(2025, 1, 1);
    const newEnd = DateTime.local(2045, 12, 31);

    cy.section('Make changes', () => {
      TerminalDetailsPage.versioningRow.getEditValidityButton().click();

      TerminalDetailsPage.editTerminalValidityModal.form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('Validity change test');
      TerminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
        validityStartISODate: newStart.toISODate() ?? '',
        validityEndISODate: newEnd.toISODate() ?? '',
      });
      TerminalDetailsPage.editTerminalValidityModal.form.submitButton().click();

      waitForValidityEditToBeFinished();
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();

    cy.section('Check changed details', () => {
      const { terminalDetails } =
        TerminalChangeHistory.changeHistoryTable.changedValues;

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          terminalDetails
            .getValidityStart()
            .within(
              assertValueChanged([
                initialValidityStart.toFormat('d.L.yyyy'),
                newStart.toFormat('d.L.yyyy'),
              ]),
            );
          terminalDetails
            .getValidityEnd()
            .within(
              assertValueChanged([
                initialValidityEnd.toFormat('d.L.yyyy'),
                newEnd.toFormat('d.L.yyyy'),
              ]),
            );
        });
    });
  });

  it('Should filter and page items', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    cy.section('Make changes to name', () => {
      TerminalDetailsPage.terminalDetails.getEditButton().click();
      TerminalDetailsPage.terminalDetails.edit
        .getName()
        .clearAndType(changedBasicDetails.name);
      TerminalDetailsPage.terminalDetails.getSaveButton().click();
      waitForSaveToBeFinished();
    });

    cy.section('Check paging', () => {
      cy.visit('/stop-registry/terminals/T2/history?pageSize=1');

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .should('have.length', 1);
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() => {
          TerminalChangeHistory.changeHistoryTable.changedValues.terminalDetails
            .getNameFin()
            .within(() => {
              TerminalChangeHistory.changeHistoryTable.changedValues
                .getNewValue()
                .shouldHaveText(changedBasicDetails.name);
            });
        });

      Pagination.getPageButton(3).should('not.exist');
      Pagination.getPageButton(2).shouldBeVisible().click();

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .should('have.length', 1);
      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .eq(0)
        .within(() =>
          TerminalChangeHistory.changeHistoryTable.sectionHeader
            .getCreatedTerminalVersion()
            .shouldBeVisible(),
        );
    });

    cy.section('Check filtering', () => {
      cy.visit('/stop-registry/terminals/T2/history?pageSize=10');

      TerminalChangeHistory.dateFilter
        .getToDate()
        .focus()
        .inputDateValue(DateTime.now().minus({ months: 1 }));

      TerminalChangeHistory.changeHistoryTable.group
        .getAllGroupElements()
        .should('have.length', 0);
    });
  });

  it('Should sort items', () => {
    initTestData();

    TerminalDetailsPage.visit('T2');

    const start = DateTime.local(2026, 1, 1);
    const mid = DateTime.local(2026, 6, 15);
    const end = DateTime.local(2026, 10, 31);

    cy.section('Make changes to validity period', () => {
      TerminalDetailsPage.versioningRow.getEditValidityButton().click();
      TerminalDetailsPage.editTerminalValidityModal.form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('First validity change');
      TerminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
        validityStartISODate: start.toISODate() ?? '',
        validityEndISODate: mid.toISODate() ?? '',
      });
      TerminalDetailsPage.editTerminalValidityModal.form.submitButton().click();
      waitForValidityEditToBeFinished();

      TerminalDetailsPage.versioningRow.getEditValidityButton().click();
      TerminalDetailsPage.editTerminalValidityModal.form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('Second validity change');
      TerminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
        validityStartISODate: mid.toISODate() ?? '',
        validityEndISODate: end.toISODate() ?? '',
      });
      TerminalDetailsPage.editTerminalValidityModal.form.submitButton().click();
      waitForValidityEditToBeFinished();
    });

    TerminalDetailsPage.versioningRow.getChangeHistoryLink().click();
    TerminalChangeHistory.changeHistoryTable.group
      .getAllGroupElements()
      .should('have.length', 3);

    cy.section('Check sorting by change time - Descending (default)', () => {
      TerminalChangeHistory.changeHistoryTable.sortByButton
        .getChanged()
        .should('have.attr', 'data-is-active', 'true')
        .and('have.attr', 'data-sort-direction', 'desc');

      assertGroupValidityPeriod(0, mid, end);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, initialValidityStart, initialValidityEnd);
    });

    cy.section('Check sorting by change time - Ascending', () => {
      TerminalChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'Changed',
        'asc',
      );

      assertGroupValidityPeriod(0, initialValidityStart, initialValidityEnd);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, mid, end);
    });

    cy.section('Check sorting by validity start - Ascending', () => {
      TerminalChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityStart',
        'asc',
      );

      assertGroupValidityPeriod(0, initialValidityStart, initialValidityEnd);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, mid, end);
    });

    cy.section('Check sorting by validity start - Descending', () => {
      TerminalChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityStart',
        'desc',
      );

      assertGroupValidityPeriod(0, mid, end);
      assertGroupValidityPeriod(1, start, mid);
      assertGroupValidityPeriod(2, initialValidityStart, initialValidityEnd);
    });

    cy.section('Check sorting by validity End - Ascending', () => {
      TerminalChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityEnd',
        'asc',
      );

      assertGroupValidityPeriod(0, start, mid);
      assertGroupValidityPeriod(1, mid, end);
      assertGroupValidityPeriod(2, initialValidityStart, initialValidityEnd);
    });

    cy.section('Check sorting by validity End - Descending', () => {
      TerminalChangeHistory.changeHistoryTable.sortByButton.sortBy(
        'ValidityEnd',
        'desc',
      );

      assertGroupValidityPeriod(0, initialValidityStart, initialValidityEnd);
      assertGroupValidityPeriod(1, mid, end);
      assertGroupValidityPeriod(2, start, mid);
    });
  });
});
