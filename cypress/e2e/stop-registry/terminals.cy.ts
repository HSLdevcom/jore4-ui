import {
  StopRegistryGeoJsonType,
  TerminalInput,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  AlternativeNames,
  AlternativeNamesEdit,
  ExternalLinksForm,
  ExternalLinksSection,
  Map,
  TerminalDetailsPage,
  TerminalInfoSpotRow,
  TerminalInfoSpotsSection,
  TerminalInfoSpotsViewCard,
  TerminalInfoSpotsViewList,
  Toast,
} from '../../pageObjects';
import { SelectTerminalMemberStopsDropdown } from '../../pageObjects/forms/SelectTerminalMemberStopsDropdown';
import { TerminalPopup } from '../../pageObjects/stop-registry/TerminalPopup';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

type ExpectedBasicDetails = {
  readonly description: string;
  readonly name: string;
  readonly nameSwe: string;
  readonly nameEng: string;
  readonly nameLongFin: string;
  readonly nameLongSwe: string;
  readonly nameLongEng: string;
  readonly abbreviationFin: string;
  readonly abbreviationSwe: string;
  readonly abbreviationEng: string;
  readonly terminalType: string;
  readonly departurePlatforms: string;
  readonly arrivalPlatforms: string;
  readonly loadingPlatforms: string;
  readonly electricCharging: string;
};

type LocationDetailUpdates = {
  readonly streetAddress: string;
  readonly postalCode: string;
};

type ExpectedLocationDetails = {
  readonly streetAddress: string;
  readonly postalCode: string;
  readonly municipality: string;
  readonly fareZone: string;
  readonly memberPlatforms: string;
};

describe('Terminal details', { tags: [Tag.StopRegistry, Tag.Map] }, () => {
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const baseTerminalInput: TerminalInput = {
    terminal: {
      ...baseStopRegistryData.terminals[0].terminal,
      privateCode: { type: 'HSL/TEST', value: 'T3' },
      name: { lang: 'fin', value: 'E2ET002' },
      description: { lang: 'fin', value: 'E2E testiterminaali #2' },
      geometry: {
        coordinates: [24.92744521, 60.16974018],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    memberLabels: ['E2E007'],
  };

  const terminalData: ReadonlyArray<TerminalInput> = [baseTerminalInput];

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      const stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');

    insertToDbHelper(dbResources);
    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      ...baseStopRegistryData,
      terminals: baseStopRegistryData.terminals.concat(terminalData),
    }).then(() => {
      cy.setupTests();
      cy.mockLogin();

      TerminalDetailsPage.visit('T2');
    });
  });

  function waitForSaveToBeFinished() {
    expectGraphQLCallToSucceed('@gqlUpdateTerminal');
    Toast.expectSuccessToast('Terminaali muokattu');
  }

  function waitForValidityEditToBeFinished() {
    expectGraphQLCallToSucceed('@gqlUpdateTerminal');
    Toast.expectSuccessToast('Voimassaoloaika muokattu');
  }

  function waitForTerminalInfoSpotSaveToBeFinished() {
    expectGraphQLCallToSucceed('@gqlUpdateInfoSpot');
    Toast.expectSuccessToast('Terminaali muokattu');
  }

  function assertBasicDetails(expected: ExpectedBasicDetails) {
    TerminalDetailsPage.titleRow.getName().shouldHaveText(expected.name);

    const { terminalDetails } = TerminalDetailsPage;
    const { viewCard } = terminalDetails;
    viewCard.getNameFin().shouldHaveText(expected.name);
    viewCard.getNameSwe().shouldHaveText(expected.nameSwe);
    viewCard.getDescription().shouldHaveText(expected.description);
    AlternativeNames.getNameEng().shouldHaveText(expected.nameEng);
    AlternativeNames.getNameLongFin().shouldHaveText(expected.nameLongFin);
    AlternativeNames.getNameLongSwe().shouldHaveText(expected.nameLongSwe);
    AlternativeNames.getNameLongEng().shouldHaveText(expected.nameLongEng);
    AlternativeNames.getAbbreviationFin().shouldHaveText(
      expected.abbreviationFin,
    );
    AlternativeNames.getAbbreviationSwe().shouldHaveText(
      expected.abbreviationSwe,
    );
    AlternativeNames.getAbbreviationEng().shouldHaveText(
      expected.abbreviationEng,
    );
  }

  const verifyInitialBasicDetails = () => {
    const bdView = TerminalDetailsPage.terminalDetails.viewCard;

    bdView.getContent().shouldBeVisible();
    bdView.getPrivateCode().shouldHaveText('T2');
    bdView.getDescription().shouldHaveText('E2E testiterminaali');
    bdView.getNameFin().shouldHaveText('E2ET001');
    bdView.getNameSwe().shouldHaveText('Terminalen');
    AlternativeNames.getNameEng().shouldHaveText('Terminal');
    AlternativeNames.getNameLongFin().shouldHaveText('Terminaali pitkänimi');
    AlternativeNames.getNameLongSwe().shouldHaveText('Terminalen långnamn');
    AlternativeNames.getNameLongEng().shouldHaveText('Terminal long name');
    AlternativeNames.getAbbreviationFin().shouldHaveText('Terminaali');
    AlternativeNames.getAbbreviationSwe().shouldHaveText('Terminalen');
    AlternativeNames.getAbbreviationEng().shouldHaveText('Terminal');
    bdView.getTerminalType().shouldHaveText('Bussiterminaali');
    bdView.getDeparturePlatforms().shouldHaveText('7');
    bdView.getArrivalPlatforms().shouldHaveText('6');
    bdView.getLoadingPlatforms().shouldHaveText('3');
    bdView.getElectricCharging().shouldHaveText('2');
  };

  function assertLocationDetails(expected: ExpectedLocationDetails) {
    const { locationDetails } = TerminalDetailsPage;
    const { viewCard } = locationDetails;
    viewCard.getStreetAddress().shouldHaveText(expected.streetAddress);
    viewCard.getPostalCode().shouldHaveText(expected.postalCode);
    viewCard.getMunicipality().shouldHaveText(expected.municipality);
    viewCard.getFareZone().shouldHaveText(expected.fareZone);
    viewCard.getMemberPlatforms().shouldHaveText(expected.memberPlatforms);
  }

  const verifyInitialLocationDetails = () => {
    const locationView = TerminalDetailsPage.locationDetails.viewCard;

    locationView.getContainer().shouldBeVisible();
    locationView.getStreetAddress().shouldHaveText('Mannerheimintie 22-24');
    locationView.getPostalCode().shouldHaveText('00100');
    locationView.getMunicipality().shouldHaveText('Helsinki');
    locationView.getFareZone().shouldHaveText('A');
    locationView.getLatitude().shouldHaveText('60.16993495');
    locationView.getLongitude().shouldHaveText('24.92596546');
    locationView.getMemberStops().shouldHaveText('E2E008, E2E010');
    locationView.getMemberPlatforms().shouldHaveText('A3');
  };

  const verifyInitialExternalLinks = () => {
    ExternalLinksSection.getName().shouldHaveText('Terminaalin Testilinkki');
    ExternalLinksSection.getLocation().should(
      'have.attr',
      'href',
      'https://terminaltest.fi',
    );
  };

  function assertOwnerDetails() {
    const { view } = TerminalDetailsPage.owner;

    view.getName().shouldHaveText('Omistaja');
    view.getPhone().shouldHaveText('+3585645638');
    view.getEmail().shouldHaveText('jore4.testi.email@hsl.fi');

    view.getContractId().shouldHaveText('123456-789');
    view.getNote().shouldHaveText('Kattaa koko E2E Testiterminaalin alueen');
  }

  describe('basic details', () => {
    it('should view basic details', { tags: [Tag.Smoke] }, () => {
      TerminalDetailsPage.page().shouldBeVisible();

      TerminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');
      TerminalDetailsPage.titleRow.getName().shouldHaveText('E2ET001');
      TerminalDetailsPage.validityPeriod().should(
        'contain',
        '1.1.2020-1.1.2050',
      );

      TerminalDetailsPage.versioningRow
        .getChangeHistoryLink()
        .shouldBeVisible()
        .invoke('text')
        .should('match', /\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}/); // Matches format: DD.MM.YYYY HH:mm

      verifyInitialBasicDetails();
    });

    function inputBasicDetails(inputs: ExpectedBasicDetails) {
      const { edit } = TerminalDetailsPage.terminalDetails;

      edit.getDescription().clearAndType(inputs.description);
      edit.getName().clearAndType(inputs.name);
      edit.getNameSwe().clearAndType(inputs.nameSwe);
      AlternativeNamesEdit.getNameEng().clearAndType(inputs.nameEng);
      AlternativeNamesEdit.getNameLongFin().clearAndType(inputs.nameLongFin);
      AlternativeNamesEdit.getNameLongSwe().clearAndType(inputs.nameLongSwe);
      AlternativeNamesEdit.getNameLongEng().clearAndType(inputs.nameLongEng);
      AlternativeNamesEdit.getAbbreviationFin().clearAndType(
        inputs.abbreviationFin,
      );
      AlternativeNamesEdit.getAbbreviationSwe().clearAndType(
        inputs.abbreviationSwe,
      );
      AlternativeNamesEdit.getAbbreviationEng().clearAndType(
        inputs.abbreviationEng,
      );
      edit.selectTerminalType(inputs.terminalType);
      edit.getDeparturePlatforms().clearAndType(inputs.departurePlatforms);
      edit.getArrivalPlatforms().clearAndType(inputs.arrivalPlatforms);
      edit.getLoadingPlatforms().clearAndType(inputs.loadingPlatforms);
      edit.getElectricCharging().clearAndType(inputs.electricCharging);
    }

    it('should edit basic details', () => {
      verifyInitialBasicDetails();

      const newBasicDetails: ExpectedBasicDetails = {
        description: 'New description',
        name: 'New name',
        nameSwe: 'New name swe',
        nameEng: 'New name eng',
        nameLongFin: 'New name long fin',
        nameLongSwe: 'New name long swe',
        nameLongEng: 'New name long eng',
        abbreviationFin: 'New abbreviation swe',
        abbreviationSwe: 'New abbreviation swe',
        abbreviationEng: 'New abbreviation eng',
        terminalType: 'TramTerminal',
        departurePlatforms: '1',
        arrivalPlatforms: '1',
        loadingPlatforms: '1',
        electricCharging: '1',
      };

      // Edit basic details
      TerminalDetailsPage.terminalDetails.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      TerminalDetailsPage.terminalDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      // Should have saved the changes and be back at view mode with new details
      assertBasicDetails(newBasicDetails);

      // And the basic details should still match newBasicDetails
      assertBasicDetails(newBasicDetails);
    });

    it('should have working locator button', () => {
      TerminalDetailsPage.titleRow.getLocatorButton().click();

      Map.waitForLoadToComplete();

      TerminalPopup.getLabel().shouldHaveText('T2 E2ET001');
    });
  });

  describe('location details', () => {
    it('should view location details', () => {
      TerminalDetailsPage.page().shouldBeVisible();

      TerminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');

      verifyInitialLocationDetails();
    });

    function inputLocationDetails(inputs: LocationDetailUpdates) {
      const { edit } = TerminalDetailsPage.locationDetails;

      edit.getStreetAddress().clearAndType(inputs.streetAddress);
      edit.getPostalCode().clearAndType(inputs.postalCode);
    }

    it('should edit location details', () => {
      verifyInitialLocationDetails();

      const updates: LocationDetailUpdates = {
        streetAddress: 'New street address',
        postalCode: 'New postal code',
      };

      const newLocationDetails: ExpectedLocationDetails = {
        ...updates,
        municipality: 'Helsinki',
        fareZone: 'A',
        memberPlatforms: 'A3',
      };

      // Edit location details
      TerminalDetailsPage.locationDetails.getEditButton().click();
      inputLocationDetails(updates);
      TerminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      // Should have saved the changes and be back at view mode with new details
      assertLocationDetails(newLocationDetails);

      // And the location details should still match newLocationDetails
      assertLocationDetails(newLocationDetails);
    });

    it('should add member stops', () => {
      verifyInitialLocationDetails();
      const { edit } = TerminalDetailsPage.locationDetails;

      // Add member stop
      TerminalDetailsPage.locationDetails.getEditButton().click();
      edit.getSelectMemberStops().within(() => {
        SelectTerminalMemberStopsDropdown.dropdownButton().click();
        SelectTerminalMemberStopsDropdown.getInput().clearAndType('E2E009');
      });
      SelectTerminalMemberStopsDropdown.common
        .getMemberOptions()
        .should('have.length', 1);
      SelectTerminalMemberStopsDropdown.common
        .getMemberOptions()
        .eq(0)
        .should('contain.text', 'E2E009')
        .click();
      cy.closeDropdown();

      TerminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      TerminalDetailsPage.locationDetails.viewCard
        .getMemberStops()
        .shouldHaveText('E2E001, E2E008, E2E009, E2E010');
    });

    it('should delete member stops', () => {
      verifyInitialLocationDetails();
      const { edit } = TerminalDetailsPage.locationDetails;

      // Delete member stop
      TerminalDetailsPage.locationDetails.getEditButton().click();
      edit
        .getSelectMemberStops()
        .within(() =>
          SelectTerminalMemberStopsDropdown.dropdownButton().click(),
        );
      SelectTerminalMemberStopsDropdown.common
        .getSelectedMembers()
        .contains('E2E010')
        .click();
      cy.closeDropdown();

      TerminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      TerminalDetailsPage.locationDetails.viewCard
        .getMemberStops()
        .shouldHaveText('E2E008');

      TerminalDetailsPage.locationDetails.getEditButton().click();
      edit
        .getSelectMemberStops()
        .within(() =>
          SelectTerminalMemberStopsDropdown.dropdownButton().click(),
        );
      SelectTerminalMemberStopsDropdown.common
        .getSelectedMembers()
        .contains('E2E008')
        .click();
      cy.closeDropdown();

      SelectTerminalMemberStopsDropdown.getWarningText().shouldHaveText(
        'Terminaalilla pitää olla vähintään yksi jäsenpysäkki.',
      );

      TerminalDetailsPage.locationDetails.getSaveButton().click();
      Toast.expectDangerToast(
        'Tallennus epäonnistui: Terminaalilla pitää olla vähintään yksi jäsenpysäkki.',
      );
    });
  });

  describe('Owner details', () => {
    it('should view owner details', () => {
      TerminalDetailsPage.page().shouldBeVisible();
      assertOwnerDetails();
    });

    it('should edit owner details', () => {
      const {
        owner,
        owner: {
          view,
          edit,
          edit: { ownerModal },
        },
      } = TerminalDetailsPage;

      TerminalDetailsPage.page().shouldBeVisible();

      // Start editing owner
      owner.getEditButton().click();

      // Add a new owner
      edit.getOwnerDropdownButton().click();
      edit.getOwnerDropdownOptions().contains('Lisää uusi toimija').click();
      ownerModal.form.getName().clearAndType('Uusi nimi');
      ownerModal.form.getPhone().clearAndType('987654321');
      ownerModal.form.getEmail().clearAndType('uusi.omistaja@hsl.fi');
      ownerModal.form.getSaveButton().click();

      // Change the other fields too
      edit.getContractId().clearAndType('Uusi sopimustunnus');
      edit.getNote().clearAndType('Uudet hallintorajat');

      // Save
      owner.getSaveButton().click();
      Toast.expectSuccessToast('Terminaali muokattu');

      // Assert info has been saved
      view.getName().shouldHaveText('Uusi nimi');
      view.getPhone().shouldHaveText('987654321');
      view.getEmail().shouldHaveText('uusi.omistaja@hsl.fi');

      view.getContractId().shouldHaveText('Uusi sopimustunnus');
      view.getNote().shouldHaveText('Uudet hallintorajat');

      // All other fields should have stayd the same.
      verifyInitialBasicDetails();
      verifyInitialLocationDetails();
      verifyInitialExternalLinks();

      //  Switch back to old owner.
      owner.getEditButton().click();
      edit.getOwnerDropdownButton().click();
      edit.getOwnerDropdownOptions().contains('Omistaja').click();
      owner.getSaveButton().click();
      Toast.expectSuccessToast('Terminaali muokattu');

      view.getName().shouldHaveText('Omistaja');
      view.getPhone().shouldHaveText('+3585645638');
      view.getEmail().shouldHaveText('jore4.testi.email@hsl.fi');
    });
  });

  describe('external links', () => {
    const externalLinksForm = ExternalLinksForm;

    it(
      'should view and edit external links',
      { tags: [Tag.StopRegistry] },
      () => {
        ExternalLinksSection.getTitle().shouldHaveText('Linkit');
        ExternalLinksSection.getExternalLinks().shouldBeVisible();
        ExternalLinksSection.getNthExternalLink(0).within(() => {
          verifyInitialExternalLinks();
        });

        ExternalLinksSection.getEditButton().click();
        ExternalLinksForm.externalLinks
          .getNameInput()
          .clearAndType('Linkin nimi');
        ExternalLinksForm.externalLinks
          .getLocationInput()
          .clearAndType('http://www.example.com');
        ExternalLinksForm.getSaveButton().click();
        ExternalLinksSection.getNoExternalLinks().should('not.exist');
        ExternalLinksSection.getExternalLinks().should('have.length', 1);

        ExternalLinksSection.getNthExternalLink(0).within(() => {
          ExternalLinksSection.getName().shouldHaveText('Linkin nimi');
          ExternalLinksSection.getLocation().should(
            'have.attr',
            'href',
            'http://www.example.com',
          );
        });
      },
    );

    it(
      'should add and delete external links',
      { tags: [Tag.StopRegistry] },
      () => {
        ExternalLinksSection.getTitle().shouldHaveText('Linkit');
        ExternalLinksSection.getExternalLinks().shouldBeVisible();
        ExternalLinksSection.getNthExternalLink(0).within(() => {
          verifyInitialExternalLinks();
        });

        ExternalLinksSection.getEditButton().click();
        ExternalLinksForm.getAddNewButton().click();
        ExternalLinksForm.getNthExternalLink(1).within(() => {
          ExternalLinksForm.externalLinks
            .getNameInput()
            .clearAndType('Linkin nimi 2');
          ExternalLinksForm.externalLinks
            .getLocationInput()
            .clearAndType('http://www.example2.com');
        });
        ExternalLinksForm.getSaveButton().click();
        waitForSaveToBeFinished();

        ExternalLinksSection.getNoExternalLinks().should('not.exist');
        ExternalLinksSection.getExternalLinks().should('have.length', 2);

        ExternalLinksSection.getNthExternalLink(0).within(() => {
          ExternalLinksSection.getName().shouldHaveText(
            'Terminaalin Testilinkki',
          );
        });
        ExternalLinksSection.getNthExternalLink(1).within(() => {
          ExternalLinksSection.getName().shouldHaveText('Linkin nimi 2');
        });

        ExternalLinksSection.getEditButton().click();
        externalLinksForm.getNthExternalLink(0).within(() => {
          externalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        externalLinksForm.getSaveButton().click();
        waitForSaveToBeFinished();

        ExternalLinksSection.getExternalLinks().should('have.length', 1);
        ExternalLinksSection.getNthExternalLink(0).within(() => {
          ExternalLinksSection.getName().shouldHaveText('Linkin nimi 2');
        });

        ExternalLinksSection.getEditButton().click();
        ExternalLinksForm.getNthExternalLink(0).within(() => {
          ExternalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        ExternalLinksForm.getSaveButton().click();
        waitForSaveToBeFinished();

        ExternalLinksSection.getExternalLinks().should('have.length', 0);
        ExternalLinksSection.getNoExternalLinks().shouldBeVisible();
        ExternalLinksSection.getNoExternalLinks().shouldHaveText('Ei linkkejä');
      },
    );
  });

  describe('terminal validity', () => {
    it('should edit terminal validity', () => {
      TerminalDetailsPage.validityPeriod().should(
        'contain',
        '1.1.2020-1.1.2050',
      );

      TerminalDetailsPage.versioningRow
        .getEditValidityButton()
        .shouldBeVisible()
        .click();

      TerminalDetailsPage.editTerminalValidityModal
        .getModal()
        .shouldBeVisible();

      TerminalDetailsPage.editTerminalValidityModal.form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('Edit #1');
      TerminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
        validityStartISODate: '2023-01-01',
        validityEndISODate: '2040-01-01',
      });
      TerminalDetailsPage.editTerminalValidityModal.form.submitButton().click();

      waitForValidityEditToBeFinished();

      TerminalDetailsPage.validityPeriod().should(
        'contain',
        '1.1.2023-1.1.2040',
      );
    });

    it(
      'should edit terminal validity to be indefinite',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.validityPeriod().should(
          'contain',
          '1.1.2020-1.1.2050',
        );

        TerminalDetailsPage.versioningRow
          .getEditValidityButton()
          .shouldBeVisible()
          .click();

        TerminalDetailsPage.editTerminalValidityModal
          .getModal()
          .shouldBeVisible();

        TerminalDetailsPage.editTerminalValidityModal.form.reasonForChange
          .getReasonForChangeInput()
          .clearAndType('Edit #1');
        TerminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
          validityStartISODate: '2023-01-01',
        });
        TerminalDetailsPage.editTerminalValidityModal.form
          .submitButton()
          .click();

        waitForValidityEditToBeFinished();

        TerminalDetailsPage.validityPeriod().should('contain', '1.1.2023-');
      },
    );

    it(
      'should set observation date after edit',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.visit('T2', '2025-01-01');

        TerminalDetailsPage.validityPeriod().should(
          'contain',
          '1.1.2020-1.1.2050',
        );

        TerminalDetailsPage.versioningRow
          .getEditValidityButton()
          .shouldBeVisible()
          .click();

        TerminalDetailsPage.editTerminalValidityModal
          .getModal()
          .shouldBeVisible();

        TerminalDetailsPage.editTerminalValidityModal.form.reasonForChange
          .getReasonForChangeInput()
          .clearAndType('Edit #1');
        TerminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
          validityStartISODate: '2030-01-01',
          validityEndISODate: '2040-01-01',
        });
        TerminalDetailsPage.editTerminalValidityModal.form
          .submitButton()
          .click();

        waitForValidityEditToBeFinished();

        TerminalDetailsPage.observationDateControl
          .getObservationDateInput()
          .should('have.value', '2030-01-01');

        TerminalDetailsPage.validityPeriod().should(
          'contain',
          '1.1.2030-1.1.2040',
        );
      },
    );
  });

  describe('stops tab', () => {
    it(
      'should display stops tab with correct count',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector()
          .getStopsTab()
          .shouldHaveText('Pysäkit (2)');
      },
    );

    it(
      'should open stops tab and display member stops',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getStopsTab().click();

        TerminalDetailsPage.stopsPage.getTitle().shouldHaveText('Pysäkit');
        TerminalDetailsPage.stopsPage.getStopAreas().should('have.length', 2);

        TerminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          TerminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Finnoonkartano');

          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .find('tbody tr')
            .should('have.length', 1);
        });

        TerminalDetailsPage.stopsPage.getNthStopArea(1).within(() => {
          TerminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Kuttulammentie');

          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .find('tbody tr')
            .should('have.length', 1);
        });
      },
    );

    it(
      'should navigate to stop area details when clicking stop area link',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getStopsTab().click();

        TerminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          TerminalDetailsPage.stopsPage.getStopAreaHeader().click();
        });

        cy.url().should('include', '/stop-registry/stop-areas/');
      },
    );

    it(
      'should be able to add stops to terminal on stops tab',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();
        TerminalDetailsPage.getTabSelector().getStopsTab().click();

        TerminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
        TerminalDetailsPage.stopsPage.addStopsModal
          .getModal()
          .shouldBeVisible();

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();
        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .getInput()
          .type('E2E009', { force: true });
        TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .should('have.length', 1);

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'E2E009')
          .click();

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();

        TerminalDetailsPage.stopsPage.addStopsModal.getSaveButton().click();

        TerminalDetailsPage.stopsPage.getStopAreas().should('have.length', 3);

        TerminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          TerminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Annankatu 15');
          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .find('tbody tr')
            .should('have.length', 2);
        });
      },
    );

    it(
      'should be able to remove stops from terminal on stops tab',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();
        TerminalDetailsPage.getTabSelector().getStopsTab().click();

        TerminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
        TerminalDetailsPage.stopsPage.addStopsModal
          .getModal()
          .shouldBeVisible();

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getSelectedMembers()
          .should('have.length', 2);
        TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getSelectedMembers()
          .contains('E2E008')
          .click();

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();

        TerminalDetailsPage.stopsPage.addStopsModal.getSaveButton().click();

        TerminalDetailsPage.stopsPage.getStopAreas().should('have.length', 1);

        TerminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          TerminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Finnoonkartano');
          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          TerminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .find('tbody tr')
            .should('have.length', 1);
        });
      },
    );

    it(
      'should not be able to add stops that belong to a different terminal',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();
        TerminalDetailsPage.getTabSelector().getStopsTab().click();

        TerminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
        TerminalDetailsPage.stopsPage.addStopsModal
          .getModal()
          .shouldBeVisible();

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();
        TerminalDetailsPage.stopsPage.addStopsModal.dropdown
          .getInput()
          .type('E2E007', { force: true });

        TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .should('have.length', 1);
        TerminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'E2E007')
          .should('have.attr', 'aria-disabled', 'true');
      },
    );
  });

  describe('info spots', () => {
    it(
      'should display info spots tab and view info spots',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector()
          .getInfoSpotsTab()
          .shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

        TerminalDetailsPage.infoSpots.getContainer().shouldBeVisible();
        TerminalDetailsPage.infoSpots.getTitle().shouldBeVisible();

        TerminalInfoSpotsViewList.getTable().shouldBeVisible();

        TerminalInfoSpotsViewList.getLabelSortButton().shouldBeVisible();
        TerminalInfoSpotsViewList.getStopSortButton().shouldBeVisible();
        TerminalInfoSpotsViewList.getShelterSortButton().shouldBeVisible();
        TerminalInfoSpotsViewList.getPurposeSortButton().shouldBeVisible();
        TerminalInfoSpotsViewList.getSizeSortButton().shouldBeVisible();
        TerminalInfoSpotsViewList.getDescriptionSortButton().shouldBeVisible();
      },
    );

    it(
      'should expand info spot details when clicking toggle button',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
        TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
          TerminalInfoSpotRow.getLabelCell().shouldHaveText('E2E_INFO_001');
          TerminalInfoSpotRow.getQuayPublicCodeCell().shouldHaveText('E2E008');
          TerminalInfoSpotRow.getShelterNumberCell().shouldHaveText('1');
          TerminalInfoSpotRow.getPurposeCell().shouldHaveText('Tiedotteet');
          TerminalInfoSpotRow.getSizeCell().shouldHaveText('80 × 120 cm');
          TerminalInfoSpotRow.getDescriptionCell().shouldHaveText(
            'Terminaalin infopiste',
          );
        });

        TerminalInfoSpotRow.getNthToggleButton(0).click();
        TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
          TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
            'Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie',
          );
        });
        TerminalInfoSpotsViewCard.getContainer().shouldBeVisible();
        TerminalInfoSpotsViewCard.getLabel().shouldHaveText('E2E_INFO_001');
        TerminalInfoSpotsViewCard.getPurpose().shouldHaveText('Tiedotteet');
        TerminalInfoSpotsViewCard.getBacklight().shouldHaveText('Kyllä');
        TerminalInfoSpotsViewCard.getSize().shouldHaveText('80 × 120 cm');
        TerminalInfoSpotsViewCard.getFloor().shouldHaveText('1');
        TerminalInfoSpotsViewCard.getRailInformation().shouldHaveText('1');
        TerminalInfoSpotsViewCard.getZoneLabel().shouldHaveText('A');
        TerminalInfoSpotsViewCard.getDescription().shouldHaveText(
          'Terminaalin infopiste',
        );
        TerminalInfoSpotsViewCard.getPosterSize().shouldHaveText(
          'A4 (21.0 × 29.7 cm)',
        );
        TerminalInfoSpotsViewCard.getPosterLabel().shouldHaveText(
          'E2E_POSTER_001',
        );
        TerminalInfoSpotsViewCard.getPosterLines().shouldHaveText('1, 2, 3');
      },
    );

    it(
      'should hide info spots when toggle button is clicked',
      {
        tags: [Tag.StopRegistry],
      },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
        TerminalInfoSpotsSection.getToggleButton().click();

        TerminalInfoSpotRow.getNthDetailsRow(0).should('not.be.visible');

        TerminalInfoSpotsSection.getToggleButton().click();
        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
      },
    );

    it(
      'should edit existing quay info spot',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
        TerminalInfoSpotRow.getNthToggleButton(0).click();

        TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
          TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
            'Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie',
          );
        });

        TerminalInfoSpotRow.getEditButton().click();
        TerminalInfoSpotsSection.form.formFields
          .getLabel()
          .clearAndType('E2E_INFO_001_EDIT');

        // Location should be disabled for quay info spot
        TerminalInfoSpotsSection.form.formFields
          .getLatitude()
          .shouldBeDisabled();
        TerminalInfoSpotsSection.form.formFields
          .getLongitude()
          .shouldBeDisabled();

        TerminalInfoSpotRow.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
          TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
            'Infopaikka E2E_INFO_001_EDIT | E2E008 Kuttulammentie',
          );
        });
      },
    );

    it(
      'should add new terminal info spot',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        TerminalInfoSpotsSection.getAddNewButton().click();

        TerminalInfoSpotsSection.form.formFields
          .getLabel()
          .clearAndType('E2E_INFO_002');
        TerminalInfoSpotsSection.form.formFields.getPurposeButton().click();
        TerminalInfoSpotsSection.form.formFields
          .getPurposeOptions()
          .contains('Tiedotteet')
          .click();
        TerminalInfoSpotsSection.form.formFields
          .getSizeSelectorButton()
          .click();
        TerminalInfoSpotsSection.form.formFields
          .getSizeSelectorOptions()
          .contains('80 × 120 cm')
          .click();

        TerminalInfoSpotsSection.form.formFields.getBacklightButton().click();
        TerminalInfoSpotsSection.form.formFields
          .getBacklightOptions()
          .contains('Kyllä')
          .click();

        // Confirm that default location is set correctly
        TerminalInfoSpotsSection.form.formFields
          .getLatitude()
          .should('have.value', '60.16993495');
        TerminalInfoSpotsSection.form.formFields
          .getLongitude()
          .should('have.value', '24.92596546');

        // Set custom location
        TerminalInfoSpotsSection.form.formFields
          .getLatitude()
          .clearAndType('60.170000');
        TerminalInfoSpotsSection.form.formFields
          .getLongitude()
          .clearAndType('24.926000');

        TerminalInfoSpotsSection.form.formFields
          .getZoneLabel()
          .clearAndType('A');
        TerminalInfoSpotsSection.form.formFields.getFloor().clearAndType('1');
        TerminalInfoSpotsSection.form.formFields
          .getDescription()
          .clearAndType('Toinen terminaalin infopiste');

        TerminalInfoSpotsSection.form.formFields.getAddPosterButton().click();
        TerminalInfoSpotsSection.form.formFields
          .getNthPosterContainer(0)
          .within(() => {
            TerminalInfoSpotsSection.form.formFields
              .getSizeSelectorButton()
              .click();
            cy.withinHeadlessPortal(() =>
              TerminalInfoSpotsSection.form.formFields
                .getSizeSelectorOptions()
                .contains('80 × 120 cm')
                .click(),
            );

            TerminalInfoSpotsSection.form.formFields
              .getPosterLabel()
              .clearAndType('E2E_002_POSTER_001');
            TerminalInfoSpotsSection.form.formFields
              .getPosterDetails()
              .clearAndType('Kartta');
          });

        TerminalInfoSpotsSection.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        TerminalInfoSpotsViewList.getSortButton('label').click();

        TerminalInfoSpotRow.getNthDetailsRow(1).shouldBeVisible();
        TerminalInfoSpotRow.getNthDetailsRow(1).within(() => {
          TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
            'Infopaikka E2E_INFO_002',
          );
        });

        TerminalInfoSpotsViewCard.getContainer().shouldBeVisible();
        TerminalInfoSpotsViewCard.getLabel().shouldHaveText('E2E_INFO_002');
        TerminalInfoSpotsViewCard.getPurpose().shouldHaveText('Tiedotteet');
        TerminalInfoSpotsViewCard.getBacklight().shouldHaveText('Kyllä');
        TerminalInfoSpotsViewCard.getSize().shouldHaveText('80 × 120 cm');
        TerminalInfoSpotsViewCard.getFloor().shouldHaveText('1');
        TerminalInfoSpotsViewCard.getRailInformation().shouldHaveText('-');
        TerminalInfoSpotsViewCard.getZoneLabel().shouldHaveText('A');
        TerminalInfoSpotsViewCard.getDescription().shouldHaveText(
          'Toinen terminaalin infopiste',
        );
        TerminalInfoSpotsViewCard.getPosterSize().shouldHaveText('80 × 120 cm');
        TerminalInfoSpotsViewCard.getPosterLabel().shouldHaveText(
          'E2E_002_POSTER_001',
        );
        TerminalInfoSpotsViewCard.getPosterLines().shouldHaveText('Kartta');
      },
    );

    it('should delete terminal info spot', () => {
      TerminalDetailsPage.page().shouldBeVisible();

      TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
      TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
      TerminalInfoSpotRow.getNthToggleButton(0).click();
      TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
        TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
          'Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie',
        );
      });

      TerminalInfoSpotRow.getEditButton().click();
      TerminalInfoSpotsSection.form.formFields
        .getDeleteInfoSpotButton()
        .click();

      TerminalInfoSpotRow.getSaveButton().click();
      waitForTerminalInfoSpotSaveToBeFinished();

      TerminalInfoSpotsViewList.getTableContent().should('be.empty');
    });

    it(
      'should delete terminal info spot poster',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
        TerminalInfoSpotRow.getNthToggleButton(0).click();

        TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
          TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
            'Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie',
          );
        });

        TerminalInfoSpotRow.getEditButton().click();
        TerminalInfoSpotsSection.form.formFields
          .getNthPosterContainer(0)
          .within(() => {
            TerminalInfoSpotsSection.form.formFields
              .getDeletePosterButton()
              .click();
          });

        TerminalInfoSpotRow.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
        TerminalInfoSpotsViewCard.getNoPosters().shouldBeVisible();
      },
    );

    it(
      'should add new terminal info spot poster',
      { tags: [Tag.StopRegistry] },
      () => {
        TerminalDetailsPage.page().shouldBeVisible();

        TerminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        TerminalInfoSpotRow.getNthDetailsRow(0).shouldBeVisible();
        TerminalInfoSpotRow.getNthToggleButton(0).click();

        TerminalInfoSpotRow.getNthDetailsRow(0).within(() => {
          TerminalInfoSpotRow.getIdAndQuayCell().shouldHaveText(
            'Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie',
          );
        });

        TerminalInfoSpotRow.getEditButton().click();

        TerminalInfoSpotsSection.form.formFields.getAddPosterButton().click();
        TerminalInfoSpotsSection.form.formFields
          .getNthPosterContainer(1)
          .within(() => {
            TerminalInfoSpotsSection.form.formFields
              .getSizeSelectorButton()
              .click();
            cy.withinHeadlessPortal(() =>
              TerminalInfoSpotsSection.form.formFields
                .getSizeSelectorOptions()
                .contains('80 × 120 cm')
                .click(),
            );

            TerminalInfoSpotsSection.form.formFields
              .getPosterLabel()
              .clearAndType('E2E_POSTER_002');
            TerminalInfoSpotsSection.form.formFields
              .getPosterDetails()
              .clearAndType('Kartta');
          });

        TerminalInfoSpotRow.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        // Check both poster containers, match by label, and assert other properties accordingly
        const expectedPosters = [
          {
            label: 'E2E_POSTER_001',
            lines: '1, 2, 3',
            size: 'A4 (21.0 × 29.7 cm)',
          },
          {
            label: 'E2E_POSTER_002',
            lines: 'Kartta',
            size: '80 × 120 cm',
          },
        ];

        TerminalInfoSpotsViewCard.getPosterContainer().should('have.length', 2);
        TerminalInfoSpotsViewCard.getPosterContainer().each(
          (posterContainer: JQuery<HTMLElement>) => {
            cy.wrap(posterContainer).within(() => {
              TerminalInfoSpotsViewCard.getPosterLabel()
                .invoke('text')
                .then((labelText: string) => {
                  const poster = expectedPosters.find(
                    (p) => p.label === labelText.trim(),
                  );

                  if (!poster) {
                    throw new Error(
                      `Poster with label ${labelText} should exist`,
                    );
                  }

                  TerminalInfoSpotsViewCard.getPosterLines().shouldHaveText(
                    poster.lines,
                  );
                  TerminalInfoSpotsViewCard.getPosterSize().shouldHaveText(
                    poster.size,
                  );
                });
            });
          },
        );
      },
    );
  });
});
