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
import { SelectTerminalMemberStopsDropdown } from '../../pageObjects/SelectTerminalMemberStopsDropdown';
import { TerminalPopup } from '../../pageObjects/TerminalPopup';
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
  const terminalDetailsPage = new TerminalDetailsPage();
  const alternativeNames = new AlternativeNames();
  const toast = new Toast();
  const selectTerminalMemberStopsDropdown =
    new SelectTerminalMemberStopsDropdown();
  const externalLinks = new ExternalLinksSection();

  const map = new Map();
  const terminalPopUp = new TerminalPopup();

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

      terminalDetailsPage.visit('T2');
    });
  });

  function waitForSaveToBeFinished() {
    expectGraphQLCallToSucceed('@gqlUpdateTerminal');
    toast.expectSuccessToast('Terminaali muokattu');
  }

  function waitForValidityEditToBeFinished() {
    expectGraphQLCallToSucceed('@gqlUpdateTerminal');
    toast.expectSuccessToast('Voimassaoloaika muokattu');
  }

  function waitForTerminalInfoSpotSaveToBeFinished() {
    expectGraphQLCallToSucceed('@gqlUpdateInfoSpot');
    toast.expectSuccessToast('Terminaali muokattu');
  }

  function assertBasicDetails(expected: ExpectedBasicDetails) {
    terminalDetailsPage.titleRow.getName().shouldHaveText(expected.name);

    const { terminalDetails } = terminalDetailsPage;
    const { viewCard } = terminalDetails;
    viewCard.getNameFin().shouldHaveText(expected.name);
    viewCard.getNameSwe().shouldHaveText(expected.nameSwe);
    viewCard.getDescription().shouldHaveText(expected.description);
    alternativeNames.getNameEng().shouldHaveText(expected.nameEng);
    alternativeNames.getNameLongFin().shouldHaveText(expected.nameLongFin);
    alternativeNames.getNameLongSwe().shouldHaveText(expected.nameLongSwe);
    alternativeNames.getNameLongEng().shouldHaveText(expected.nameLongEng);
    alternativeNames
      .getAbbreviationFin()
      .shouldHaveText(expected.abbreviationFin);
    alternativeNames
      .getAbbreviationSwe()
      .shouldHaveText(expected.abbreviationSwe);
    alternativeNames
      .getAbbreviationEng()
      .shouldHaveText(expected.abbreviationEng);
  }

  const verifyInitialBasicDetails = () => {
    const bdView = terminalDetailsPage.terminalDetails.viewCard;

    bdView.getContent().shouldBeVisible();
    bdView.getPrivateCode().shouldHaveText('T2');
    bdView.getDescription().shouldHaveText('E2E testiterminaali');
    bdView.getNameFin().shouldHaveText('E2ET001');
    bdView.getNameSwe().shouldHaveText('Terminalen');
    alternativeNames.getNameEng().shouldHaveText('Terminal');
    alternativeNames.getNameLongFin().shouldHaveText('Terminaali pitkänimi');
    alternativeNames.getNameLongSwe().shouldHaveText('Terminalen långnamn');
    alternativeNames.getNameLongEng().shouldHaveText('Terminal long name');
    alternativeNames.getAbbreviationFin().shouldHaveText('Terminaali');
    alternativeNames.getAbbreviationSwe().shouldHaveText('Terminalen');
    alternativeNames.getAbbreviationEng().shouldHaveText('Terminal');
    bdView.getTerminalType().shouldHaveText('Bussiterminaali');
    bdView.getDeparturePlatforms().shouldHaveText('7');
    bdView.getArrivalPlatforms().shouldHaveText('6');
    bdView.getLoadingPlatforms().shouldHaveText('3');
    bdView.getElectricCharging().shouldHaveText('2');
  };

  function assertLocationDetails(expected: ExpectedLocationDetails) {
    const { locationDetails } = terminalDetailsPage;
    const { viewCard } = locationDetails;
    viewCard.getStreetAddress().shouldHaveText(expected.streetAddress);
    viewCard.getPostalCode().shouldHaveText(expected.postalCode);
    viewCard.getMunicipality().shouldHaveText(expected.municipality);
    viewCard.getFareZone().shouldHaveText(expected.fareZone);
    viewCard.getMemberPlatforms().shouldHaveText(expected.memberPlatforms);
  }

  const verifyInitialLocationDetails = () => {
    const locationView = terminalDetailsPage.locationDetails.viewCard;

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
    const externalLinksView = externalLinks;

    externalLinksView.getName().shouldHaveText('Terminaalin Testilinkki');
    externalLinksView
      .getLocation()
      .should('have.attr', 'href', 'https://terminaltest.fi');
  };

  function assertOwnerDetails() {
    const { view } = terminalDetailsPage.owner;

    view.getName().shouldHaveText('Omistaja');
    view.getPhone().shouldHaveText('+3585645638');
    view.getEmail().shouldHaveText('jore4.testi.email@hsl.fi');

    view.getContractId().shouldHaveText('123456-789');
    view.getNote().shouldHaveText('Kattaa koko E2E Testiterminaalin alueen');
  }

  describe('basic details', () => {
    it('should view basic details', { tags: [Tag.Smoke] }, () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');
      terminalDetailsPage.titleRow.getName().shouldHaveText('E2ET001');
      terminalDetailsPage
        .validityPeriod()
        .should('contain', '1.1.2020-1.1.2050');

      terminalDetailsPage.versioningRow
        .getChangeHistoryLink()
        .shouldBeVisible()
        .invoke('text')
        .should('match', /\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}/); // Matches format: DD.MM.YYYY HH:mm

      verifyInitialBasicDetails();
    });

    function inputBasicDetails(inputs: ExpectedBasicDetails) {
      const { edit } = terminalDetailsPage.terminalDetails;
      const altEdit = new AlternativeNamesEdit();

      edit.getDescription().clearAndType(inputs.description);
      edit.getName().clearAndType(inputs.name);
      edit.getNameSwe().clearAndType(inputs.nameSwe);
      altEdit.getNameEng().clearAndType(inputs.nameEng);
      altEdit.getNameLongFin().clearAndType(inputs.nameLongFin);
      altEdit.getNameLongSwe().clearAndType(inputs.nameLongSwe);
      altEdit.getNameLongEng().clearAndType(inputs.nameLongEng);
      altEdit.getAbbreviationFin().clearAndType(inputs.abbreviationFin);
      altEdit.getAbbreviationSwe().clearAndType(inputs.abbreviationSwe);
      altEdit.getAbbreviationEng().clearAndType(inputs.abbreviationEng);
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
      terminalDetailsPage.terminalDetails.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      terminalDetailsPage.terminalDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      // Should have saved the changes and be back at view mode with new details
      assertBasicDetails(newBasicDetails);

      // And the basic details should still match newBasicDetails
      assertBasicDetails(newBasicDetails);
    });

    it('should have working locator button', () => {
      terminalDetailsPage.titleRow.getLocatorButton().click();

      map.waitForLoadToComplete();

      terminalPopUp.getLabel().shouldHaveText('T2 E2ET001');
    });
  });

  describe('location details', () => {
    it('should view location details', () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');

      verifyInitialLocationDetails();
    });

    function inputLocationDetails(inputs: LocationDetailUpdates) {
      const { edit } = terminalDetailsPage.locationDetails;

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
      terminalDetailsPage.locationDetails.getEditButton().click();
      inputLocationDetails(updates);
      terminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      // Should have saved the changes and be back at view mode with new details
      assertLocationDetails(newLocationDetails);

      // And the location details should still match newLocationDetails
      assertLocationDetails(newLocationDetails);
    });

    it('should add member stops', () => {
      verifyInitialLocationDetails();
      const { edit } = terminalDetailsPage.locationDetails;

      // Add member stop
      terminalDetailsPage.locationDetails.getEditButton().click();
      edit.getSelectMemberStops().within(() => {
        selectTerminalMemberStopsDropdown.dropdownButton().click();
        selectTerminalMemberStopsDropdown.getInput().clearAndType('E2E009');
      });
      selectTerminalMemberStopsDropdown.common
        .getMemberOptions()
        .should('have.length', 1);
      selectTerminalMemberStopsDropdown.common
        .getMemberOptions()
        .eq(0)
        .should('contain.text', 'E2E009')
        .click();
      cy.closeDropdown();

      terminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      terminalDetailsPage.locationDetails.viewCard
        .getMemberStops()
        .shouldHaveText('E2E001, E2E008, E2E009, E2E010');
    });

    it('should delete member stops', () => {
      verifyInitialLocationDetails();
      const { edit } = terminalDetailsPage.locationDetails;

      // Delete member stop
      terminalDetailsPage.locationDetails.getEditButton().click();
      edit
        .getSelectMemberStops()
        .within(() =>
          selectTerminalMemberStopsDropdown.dropdownButton().click(),
        );
      selectTerminalMemberStopsDropdown.common
        .getSelectedMembers()
        .contains('E2E010')
        .click();
      cy.closeDropdown();

      terminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      terminalDetailsPage.locationDetails.viewCard
        .getMemberStops()
        .shouldHaveText('E2E008');

      terminalDetailsPage.locationDetails.getEditButton().click();
      edit
        .getSelectMemberStops()
        .within(() =>
          selectTerminalMemberStopsDropdown.dropdownButton().click(),
        );
      selectTerminalMemberStopsDropdown.common
        .getSelectedMembers()
        .contains('E2E008')
        .click();
      cy.closeDropdown();

      selectTerminalMemberStopsDropdown
        .getWarningText()
        .shouldHaveText(
          'Terminaalilla pitää olla vähintään yksi jäsenpysäkki.',
        );

      terminalDetailsPage.locationDetails.getSaveButton().click();
      toast.expectDangerToast(
        'Tallennus epäonnistui: Terminaalilla pitää olla vähintään yksi jäsenpysäkki.',
      );
    });
  });

  describe('Owner details', () => {
    it('should view owner details', () => {
      terminalDetailsPage.page().shouldBeVisible();
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
      } = terminalDetailsPage;

      terminalDetailsPage.page().shouldBeVisible();

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
      toast.expectSuccessToast('Terminaali muokattu');

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
      toast.expectSuccessToast('Terminaali muokattu');

      view.getName().shouldHaveText('Omistaja');
      view.getPhone().shouldHaveText('+3585645638');
      view.getEmail().shouldHaveText('jore4.testi.email@hsl.fi');
    });
  });

  describe('external links', () => {
    const externalLinksView = externalLinks;
    const externalLinksForm = new ExternalLinksForm();

    it(
      'should view and edit external links',
      { tags: [Tag.StopRegistry] },
      () => {
        externalLinksView.getTitle().shouldHaveText('Linkit');
        externalLinksView.getExternalLinks().shouldBeVisible();
        externalLinksView.getNthExternalLink(0).within(() => {
          verifyInitialExternalLinks();
        });

        externalLinksView.getEditButton().click();
        externalLinksForm.externalLinks
          .getNameInput()
          .clearAndType('Linkin nimi');
        externalLinksForm.externalLinks
          .getLocationInput()
          .clearAndType('http://www.example.com');
        externalLinksForm.getSaveButton().click();
        externalLinksView.getNoExternalLinks().should('not.exist');
        externalLinksView.getExternalLinks().should('have.length', 1);

        externalLinksView.getNthExternalLink(0).within(() => {
          externalLinksView.getName().shouldHaveText('Linkin nimi');
          externalLinksView
            .getLocation()
            .should('have.attr', 'href', 'http://www.example.com');
        });
      },
    );

    it(
      'should add and delete external links',
      { tags: [Tag.StopRegistry] },
      () => {
        externalLinksView.getTitle().shouldHaveText('Linkit');
        externalLinksView.getExternalLinks().shouldBeVisible();
        externalLinksView.getNthExternalLink(0).within(() => {
          verifyInitialExternalLinks();
        });

        externalLinksView.getEditButton().click();
        externalLinksForm.getAddNewButton().click();
        externalLinksForm.getNthExternalLink(1).within(() => {
          externalLinksForm.externalLinks
            .getNameInput()
            .clearAndType('Linkin nimi 2');
          externalLinksForm.externalLinks
            .getLocationInput()
            .clearAndType('http://www.example2.com');
        });
        externalLinksForm.getSaveButton().click();
        waitForSaveToBeFinished();

        externalLinksView.getNoExternalLinks().should('not.exist');
        externalLinksView.getExternalLinks().should('have.length', 2);

        externalLinksView.getNthExternalLink(0).within(() => {
          externalLinksView.getName().shouldHaveText('Terminaalin Testilinkki');
        });
        externalLinksView.getNthExternalLink(1).within(() => {
          externalLinksView.getName().shouldHaveText('Linkin nimi 2');
        });

        externalLinksView.getEditButton().click();
        externalLinksForm.getNthExternalLink(0).within(() => {
          externalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        externalLinksForm.getSaveButton().click();
        waitForSaveToBeFinished();

        externalLinksView.getExternalLinks().should('have.length', 1);
        externalLinksView.getNthExternalLink(0).within(() => {
          externalLinksView.getName().shouldHaveText('Linkin nimi 2');
        });

        externalLinksView.getEditButton().click();
        externalLinksForm.getNthExternalLink(0).within(() => {
          externalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        externalLinksForm.getSaveButton().click();
        waitForSaveToBeFinished();

        externalLinksView.getExternalLinks().should('have.length', 0);
        externalLinksView.getNoExternalLinks().shouldBeVisible();
        externalLinksView.getNoExternalLinks().shouldHaveText('Ei linkkejä');
      },
    );
  });

  describe('terminal validity', () => {
    it('should edit terminal validity', () => {
      terminalDetailsPage
        .validityPeriod()
        .should('contain', '1.1.2020-1.1.2050');

      terminalDetailsPage.versioningRow
        .getEditValidityButton()
        .shouldBeVisible()
        .click();

      terminalDetailsPage.editTerminalValidityModal
        .getModal()
        .shouldBeVisible();

      terminalDetailsPage.editTerminalValidityModal.form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('Edit #1');
      terminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
        validityStartISODate: '2023-01-01',
        validityEndISODate: '2040-01-01',
      });
      terminalDetailsPage.editTerminalValidityModal.form.submitButton().click();

      waitForValidityEditToBeFinished();

      terminalDetailsPage
        .validityPeriod()
        .should('contain', '1.1.2023-1.1.2040');
    });

    it(
      'should edit terminal validity to be indefinite',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage
          .validityPeriod()
          .should('contain', '1.1.2020-1.1.2050');

        terminalDetailsPage.versioningRow
          .getEditValidityButton()
          .shouldBeVisible()
          .click();

        terminalDetailsPage.editTerminalValidityModal
          .getModal()
          .shouldBeVisible();

        terminalDetailsPage.editTerminalValidityModal.form.reasonForChange
          .getReasonForChangeInput()
          .clearAndType('Edit #1');
        terminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
          validityStartISODate: '2023-01-01',
        });
        terminalDetailsPage.editTerminalValidityModal.form
          .submitButton()
          .click();

        waitForValidityEditToBeFinished();

        terminalDetailsPage.validityPeriod().should('contain', '1.1.2023-');
      },
    );

    it(
      'should set observation date after edit',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.visit('T2', '2025-01-01');

        terminalDetailsPage
          .validityPeriod()
          .should('contain', '1.1.2020-1.1.2050');

        terminalDetailsPage.versioningRow
          .getEditValidityButton()
          .shouldBeVisible()
          .click();

        terminalDetailsPage.editTerminalValidityModal
          .getModal()
          .shouldBeVisible();

        terminalDetailsPage.editTerminalValidityModal.form.reasonForChange
          .getReasonForChangeInput()
          .clearAndType('Edit #1');
        terminalDetailsPage.editTerminalValidityModal.form.validity.fillForm({
          validityStartISODate: '2030-01-01',
          validityEndISODate: '2040-01-01',
        });
        terminalDetailsPage.editTerminalValidityModal.form
          .submitButton()
          .click();

        waitForValidityEditToBeFinished();

        terminalDetailsPage.observationDateControl
          .getObservationDateInput()
          .should('have.value', '2030-01-01');

        terminalDetailsPage
          .validityPeriod()
          .should('contain', '1.1.2030-1.1.2040');
      },
    );
  });

  describe('stops tab', () => {
    it(
      'should display stops tab with correct count',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage
          .getTabSelector()
          .getStopsTab()
          .shouldHaveText('Pysäkit (2)');
      },
    );

    it(
      'should open stops tab and display member stops',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getStopsTab().click();

        terminalDetailsPage.stopsPage.getTitle().shouldHaveText('Pysäkit');

        terminalDetailsPage.stopsPage.getStopAreas().should('have.length', 2);

        terminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          terminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Finnoonkartano');

          terminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          terminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .find('tbody tr')
            .should('have.length', 1);
        });

        terminalDetailsPage.stopsPage.getNthStopArea(1).within(() => {
          terminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Kuttulammentie');

          terminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          terminalDetailsPage.stopsPage
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
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getStopsTab().click();

        terminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          terminalDetailsPage.stopsPage.getStopAreaHeader().click();
        });

        cy.url().should('include', '/stop-registry/stop-areas/');
      },
    );

    it(
      'should be able to add stops to terminal on stops tab',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();
        terminalDetailsPage.getTabSelector().getStopsTab().click();

        terminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
        terminalDetailsPage.stopsPage.addStopsModal
          .getModal()
          .shouldBeVisible();

        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();
        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .getInput()
          .type('E2E009', { force: true });
        terminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .should('have.length', 1);

        terminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'E2E009')
          .click();

        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();

        terminalDetailsPage.stopsPage.addStopsModal.getSaveButton().click();

        terminalDetailsPage.stopsPage.getStopAreas().should('have.length', 3);

        terminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          terminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Annankatu 15');
          terminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          terminalDetailsPage.stopsPage
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
        terminalDetailsPage.page().shouldBeVisible();
        terminalDetailsPage.getTabSelector().getStopsTab().click();

        terminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
        terminalDetailsPage.stopsPage.addStopsModal
          .getModal()
          .shouldBeVisible();

        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();

        terminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getSelectedMembers()
          .should('have.length', 2);
        terminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getSelectedMembers()
          .contains('E2E008')
          .click();

        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();

        terminalDetailsPage.stopsPage.addStopsModal.getSaveButton().click();

        terminalDetailsPage.stopsPage.getStopAreas().should('have.length', 1);

        terminalDetailsPage.stopsPage.getNthStopArea(0).within(() => {
          terminalDetailsPage.stopsPage
            .getStopAreaHeader()
            .should('contain.text', 'Finnoonkartano');
          terminalDetailsPage.stopsPage
            .getStopAreaStopsTable()
            .shouldBeVisible();
          terminalDetailsPage.stopsPage
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
        terminalDetailsPage.page().shouldBeVisible();
        terminalDetailsPage.getTabSelector().getStopsTab().click();

        terminalDetailsPage.stopsPage.getAddStopToTerminalButton().click();
        terminalDetailsPage.stopsPage.addStopsModal
          .getModal()
          .shouldBeVisible();

        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .dropdownButton()
          .click();
        terminalDetailsPage.stopsPage.addStopsModal.dropdown
          .getInput()
          .type('E2E007', { force: true });

        terminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .should('have.length', 1);
        terminalDetailsPage.stopsPage.addStopsModal.dropdown.common
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'E2E007')
          .should('have.attr', 'aria-disabled', 'true');
      },
    );
  });

  describe('info spots', () => {
    const infoSpotsViewCard = new TerminalInfoSpotsViewCard();
    const infoSpotsViewList = new TerminalInfoSpotsViewList();
    const infoSpotsRow = new TerminalInfoSpotRow();
    const infoSpotSection = new TerminalInfoSpotsSection();
    const terminalInfoSpotsViewList = new TerminalInfoSpotsViewList();

    it(
      'should display info spots tab and view info spots',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage
          .getTabSelector()
          .getInfoSpotsTab()
          .shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

        terminalDetailsPage.infoSpots.getContainer().shouldBeVisible();
        terminalDetailsPage.infoSpots.getTitle().shouldBeVisible();

        infoSpotsViewList.getTable().shouldBeVisible();

        infoSpotsViewList.getLabelSortButton().shouldBeVisible();
        infoSpotsViewList.getStopSortButton().shouldBeVisible();
        infoSpotsViewList.getShelterSortButton().shouldBeVisible();
        infoSpotsViewList.getPurposeSortButton().shouldBeVisible();
        infoSpotsViewList.getSizeSortButton().shouldBeVisible();
        infoSpotsViewList.getDescriptionSortButton().shouldBeVisible();
      },
    );

    it(
      'should expand info spot details when clicking toggle button',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
        infoSpotsRow.getNthDetailsRow(0).within(() => {
          infoSpotsRow.getLabelCell().shouldHaveText('E2E_INFO_001');
          infoSpotsRow.getQuayPublicCodeCell().shouldHaveText('E2E008');
          infoSpotsRow.getShelterNumberCell().shouldHaveText('1');
          infoSpotsRow.getPurposeCell().shouldHaveText('Tiedotteet');
          infoSpotsRow.getSizeCell().shouldHaveText('80 × 120 cm');
          infoSpotsRow
            .getDescriptionCell()
            .shouldHaveText('Terminaalin infopiste');
        });

        infoSpotsRow.getNthToggleButton(0).click();
        infoSpotsRow.getNthDetailsRow(0).within(() => {
          infoSpotsRow
            .getIdAndQuayCell()
            .shouldHaveText('Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie');
        });
        infoSpotsViewCard.getContainer().shouldBeVisible();
        infoSpotsViewCard.getLabel().shouldHaveText('E2E_INFO_001');
        infoSpotsViewCard.getPurpose().shouldHaveText('Tiedotteet');
        infoSpotsViewCard.getBacklight().shouldHaveText('Kyllä');
        infoSpotsViewCard.getSize().shouldHaveText('80 × 120 cm');
        infoSpotsViewCard.getFloor().shouldHaveText('1');
        infoSpotsViewCard.getRailInformation().shouldHaveText('1');
        infoSpotsViewCard.getZoneLabel().shouldHaveText('A');
        infoSpotsViewCard
          .getDescription()
          .shouldHaveText('Terminaalin infopiste');
        infoSpotsViewCard.getPosterSize().shouldHaveText('A4 (21.0 × 29.7 cm)');
        infoSpotsViewCard.getPosterLabel().shouldHaveText('E2E_POSTER_001');
        infoSpotsViewCard.getPosterLines().shouldHaveText('1, 2, 3');
      },
    );

    it(
      'should hide info spots when toggle button is clicked',
      {
        tags: [Tag.StopRegistry],
      },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();

        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
        infoSpotSection.getToggleButton().click();

        infoSpotsRow.getNthDetailsRow(0).should('not.be.visible');

        infoSpotSection.getToggleButton().click();
        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
      },
    );

    it(
      'should edit existing quay info spot',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
        infoSpotsRow.getNthToggleButton(0).click();

        infoSpotsRow.getNthDetailsRow(0).within(() => {
          infoSpotsRow
            .getIdAndQuayCell()
            .shouldHaveText('Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie');
        });

        infoSpotsRow.getEditButton().click();
        infoSpotSection.form.formFields
          .getLabel()
          .clearAndType('E2E_INFO_001_EDIT');

        // Location should be disabled for quay info spot
        infoSpotSection.form.formFields.getLatitude().shouldBeDisabled();
        infoSpotSection.form.formFields.getLongitude().shouldBeDisabled();

        infoSpotsRow.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        infoSpotsRow.getNthDetailsRow(0).within(() => {
          infoSpotsRow
            .getIdAndQuayCell()
            .shouldHaveText(
              'Infopaikka E2E_INFO_001_EDIT | E2E008 Kuttulammentie',
            );
        });
      },
    );

    it(
      'should add new terminal info spot',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        infoSpotSection.getAddNewButton().click();

        infoSpotSection.form.formFields.getLabel().clearAndType('E2E_INFO_002');
        infoSpotSection.form.formFields.getPurposeButton().click();
        infoSpotSection.form.formFields
          .getPurposeOptions()
          .contains('Tiedotteet')
          .click();
        infoSpotSection.form.formFields.getSizeSelectorButton().click();
        infoSpotSection.form.formFields
          .getSizeSelectorOptions()
          .contains('80 × 120 cm')
          .click();

        infoSpotSection.form.formFields.getBacklightButton().click();
        infoSpotSection.form.formFields
          .getBacklightOptions()
          .contains('Kyllä')
          .click();

        // Confirm that default location is set correctly
        infoSpotSection.form.formFields
          .getLatitude()
          .should('have.value', '60.16993495');
        infoSpotSection.form.formFields
          .getLongitude()
          .should('have.value', '24.92596546');

        // Set custom location
        infoSpotSection.form.formFields.getLatitude().clearAndType('60.170000');
        infoSpotSection.form.formFields
          .getLongitude()
          .clearAndType('24.926000');

        infoSpotSection.form.formFields.getZoneLabel().clearAndType('A');
        infoSpotSection.form.formFields.getFloor().clearAndType('1');
        infoSpotSection.form.formFields
          .getDescription()
          .clearAndType('Toinen terminaalin infopiste');

        infoSpotSection.form.formFields.getAddPosterButton().click();
        infoSpotSection.form.formFields.getNthPosterContainer(0).within(() => {
          infoSpotSection.form.formFields.getSizeSelectorButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpotSection.form.formFields
              .getSizeSelectorOptions()
              .contains('80 × 120 cm')
              .click(),
          );

          infoSpotSection.form.formFields
            .getPosterLabel()
            .clearAndType('E2E_002_POSTER_001');
          infoSpotSection.form.formFields
            .getPosterDetails()
            .clearAndType('Kartta');
        });

        infoSpotSection.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        infoSpotsViewList.getSortButton('label').click();

        infoSpotsRow.getNthDetailsRow(1).shouldBeVisible();
        infoSpotsRow.getNthDetailsRow(1).within(() => {
          infoSpotsRow
            .getIdAndQuayCell()
            .shouldHaveText('Infopaikka E2E_INFO_002');
        });

        infoSpotsViewCard.getContainer().shouldBeVisible();
        infoSpotsViewCard.getLabel().shouldHaveText('E2E_INFO_002');
        infoSpotsViewCard.getPurpose().shouldHaveText('Tiedotteet');
        infoSpotsViewCard.getBacklight().shouldHaveText('Kyllä');
        infoSpotsViewCard.getSize().shouldHaveText('80 × 120 cm');
        infoSpotsViewCard.getFloor().shouldHaveText('1');
        infoSpotsViewCard.getRailInformation().shouldHaveText('-');
        infoSpotsViewCard.getZoneLabel().shouldHaveText('A');
        infoSpotsViewCard
          .getDescription()
          .shouldHaveText('Toinen terminaalin infopiste');
        infoSpotsViewCard.getPosterSize().shouldHaveText('80 × 120 cm');
        infoSpotsViewCard.getPosterLabel().shouldHaveText('E2E_002_POSTER_001');
        infoSpotsViewCard.getPosterLines().shouldHaveText('Kartta');
      },
    );

    it('should delete terminal info spot', () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
      infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
      infoSpotsRow.getNthToggleButton(0).click();

      infoSpotsRow.getNthDetailsRow(0).within(() => {
        infoSpotsRow
          .getIdAndQuayCell()
          .shouldHaveText('Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie');
      });

      infoSpotsRow.getEditButton().click();
      infoSpotSection.form.formFields.getDeleteInfoSpotButton().click();

      infoSpotsRow.getSaveButton().click();
      waitForTerminalInfoSpotSaveToBeFinished();

      terminalInfoSpotsViewList.getTableContent().should('be.empty');
    });

    it(
      'should delete terminal info spot poster',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
        infoSpotsRow.getNthToggleButton(0).click();

        infoSpotsRow.getNthDetailsRow(0).within(() => {
          infoSpotsRow
            .getIdAndQuayCell()
            .shouldHaveText('Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie');
        });

        infoSpotsRow.getEditButton().click();

        infoSpotSection.form.formFields.getNthPosterContainer(0).within(() => {
          infoSpotSection.form.formFields.getDeletePosterButton().click();
        });

        infoSpotsRow.getSaveButton().click();
        waitForTerminalInfoSpotSaveToBeFinished();

        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
        infoSpotsViewCard.getNoPosters().shouldBeVisible();
      },
    );

    it(
      'should add new terminal info spot poster',
      { tags: [Tag.StopRegistry] },
      () => {
        terminalDetailsPage.page().shouldBeVisible();

        terminalDetailsPage.getTabSelector().getInfoSpotsTab().click();
        infoSpotsRow.getNthDetailsRow(0).shouldBeVisible();
        infoSpotsRow.getNthToggleButton(0).click();

        infoSpotsRow.getNthDetailsRow(0).within(() => {
          infoSpotsRow
            .getIdAndQuayCell()
            .shouldHaveText('Infopaikka E2E_INFO_001 | E2E008 Kuttulammentie');
        });

        infoSpotsRow.getEditButton().click();

        infoSpotSection.form.formFields.getAddPosterButton().click();
        infoSpotSection.form.formFields.getNthPosterContainer(1).within(() => {
          infoSpotSection.form.formFields.getSizeSelectorButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpotSection.form.formFields
              .getSizeSelectorOptions()
              .contains('80 × 120 cm')
              .click(),
          );

          infoSpotSection.form.formFields
            .getPosterLabel()
            .clearAndType('E2E_POSTER_002');
          infoSpotSection.form.formFields
            .getPosterDetails()
            .clearAndType('Kartta');
        });

        infoSpotsRow.getSaveButton().click();
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

        infoSpotsViewCard.getPosterContainer().should('have.length', 2);
        infoSpotsViewCard
          .getPosterContainer()
          .each((posterContainer: JQuery<HTMLElement>) => {
            cy.wrap(posterContainer).within(() => {
              infoSpotsViewCard
                .getPosterLabel()
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

                  infoSpotsViewCard
                    .getPosterLines()
                    .shouldHaveText(poster.lines);
                  infoSpotsViewCard.getPosterSize().shouldHaveText(poster.size);
                });
            });
          });
      },
    );
  });
});
