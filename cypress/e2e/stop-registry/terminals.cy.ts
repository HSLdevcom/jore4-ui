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
  SelectMemberStopsDropdown,
  TerminalDetailsPage,
  TerminalInfoSpotRow,
  TerminalInfoSpotsViewCard,
  TerminalInfoSpotsViewList,
  Toast,
} from '../../pageObjects';
import { TerminalPopup } from '../../pageObjects/TerminalPopup';
import { SelectTerminalMemberStopsDropdown } from '../../pageObjects/SelectTerminalMemberStopsDropdown';
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
};

describe('Terminal details', () => {
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
  }

  const verifyInitialLocationDetails = () => {
    const locationView = terminalDetailsPage.locationDetails.viewCard;

    locationView.getContainer().shouldBeVisible();
    locationView.getStreetAddress().shouldHaveText('Mannerheimintie 22-24');
    locationView.getPostalCode().shouldHaveText('00100');
    locationView.getMunicipality().shouldHaveText('Helsinki');
    locationView.getFareZone().shouldHaveText('A');
    locationView.getLatitude().shouldHaveText('60.16993494912799');
    locationView.getLongitude().shouldHaveText('24.92596546020357');
    locationView.getMemberStops().shouldHaveText('E2E008, E2E010');
  };

  const verifyInitialExternalLinks = () => {
    const externalLinksView = externalLinks;

    externalLinksView.getName().shouldHaveText('Terminaalin Testilinkki');
    externalLinksView
      .getLocation()
      .should('have.attr', 'href', 'https://terminaltest.fi');
  };

  describe('basic details', () => {
    it('should view basic details', { tags: [Tag.StopRegistry] }, () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');
      terminalDetailsPage.titleRow.getName().shouldHaveText('E2ET001');
      terminalDetailsPage
        .validityPeriod()
        .should('contain', '1.1.2020-1.1.2050');

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

    it('should edit basic details', { tags: [Tag.StopRegistry] }, () => {
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
    it('should view location details', { tags: [Tag.StopRegistry] }, () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');

      verifyInitialLocationDetails();
    });

    function inputLocationDetails(inputs: LocationDetailUpdates) {
      const { edit } = terminalDetailsPage.locationDetails;

      edit.getStreetAddress().clearAndType(inputs.streetAddress);
      edit.getPostalCode().clearAndType(inputs.postalCode);
    }

    it('should edit location details', { tags: [Tag.StopRegistry] }, () => {
      verifyInitialLocationDetails();

      const updates: LocationDetailUpdates = {
        streetAddress: 'New street address',
        postalCode: 'New postal code',
      };

      const newLocationDetails: ExpectedLocationDetails = {
        ...updates,
        municipality: 'Helsinki',
        fareZone: 'A',
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

    it('should add member stops', { tags: [Tag.StopRegistry] }, () => {
      verifyInitialLocationDetails();
      const { edit } = terminalDetailsPage.locationDetails;

      // Add member stop
      terminalDetailsPage.locationDetails.getEditButton().click();
      edit.getSelectMemberStops().within(() => {
        selectTerminalMemberStopsDropdown.dropdownButton().click();
        selectTerminalMemberStopsDropdown.getInput().clearAndType('E2E009');
        selectTerminalMemberStopsDropdown.common
          .getMemberOptions()
          .should('have.length', 1);
        selectTerminalMemberStopsDropdown.common
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'E2E009')
          .click();
      });

      terminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      terminalDetailsPage.locationDetails.viewCard
        .getMemberStops()
        .shouldHaveText('E2E001, E2E008, E2E009, E2E010');
    });

    it('should delete member stops', { tags: [Tag.StopRegistry] }, () => {
      verifyInitialLocationDetails();
      const { edit } = terminalDetailsPage.locationDetails;

      // Delete member stop
      terminalDetailsPage.locationDetails.getEditButton().click();
      edit.getSelectMemberStops().within(() => {
        selectTerminalMemberStopsDropdown.dropdownButton().click();
        selectTerminalMemberStopsDropdown.common
          .getSelectedMembers()
          .contains('E2E010')
          .click();
      });

      terminalDetailsPage.locationDetails.getSaveButton().click();
      waitForSaveToBeFinished();

      terminalDetailsPage.locationDetails.viewCard
        .getMemberStops()
        .shouldHaveText('E2E008');

      terminalDetailsPage.locationDetails.getEditButton().click();
      edit.getSelectMemberStops().within(() => {
        selectTerminalMemberStopsDropdown.dropdownButton().click();
        selectTerminalMemberStopsDropdown.common
          .getSelectedMembers()
          .contains('E2E008')
          .click();
      });

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
        externalLinksView.getExternalLinks().should('have.length', 1);
        externalLinksView.getNthExternalLink(0).within(() => {
          externalLinksView.getName().shouldHaveText('Linkin nimi 2');
        });

        externalLinksView.getEditButton().click();
        externalLinksForm.getNthExternalLink(0).within(() => {
          externalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        externalLinksForm.getSaveButton().click();
        externalLinksView.getExternalLinks().should('have.length', 0);
        externalLinksView.getNoExternalLinks().shouldBeVisible();
        externalLinksView.getNoExternalLinks().shouldHaveText('Ei linkkejä');
      },
    );
  });

  describe('terminal validity', () => {
    it('should edit terminal validity', { tags: [Tag.StopRegistry] }, () => {
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

      terminalDetailsPage.editTerminalValidityModal.form
        .versionName()
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

        terminalDetailsPage.editTerminalValidityModal.form
          .versionName()
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

        terminalDetailsPage
          .getStopsSection()
          .getTitle()
          .shouldHaveText('Pysäkit');

        terminalDetailsPage
          .getStopsSection()
          .getStopAreas()
          .should('have.length', 2);

        terminalDetailsPage
          .getStopsSection()
          .getNthStopArea(0)
          .within(() => {
            terminalDetailsPage
              .getStopsSection()
              .getStopAreaHeader()
              .should('contain.text', 'Finnoonkartano');

            terminalDetailsPage
              .getStopsSection()
              .getStopAreaStopsTable()
              .shouldBeVisible();
            terminalDetailsPage
              .getStopsSection()
              .getStopAreaStopsTable()
              .find('tbody tr')
              .should('have.length', 1);
          });

        terminalDetailsPage
          .getStopsSection()
          .getNthStopArea(1)
          .within(() => {
            terminalDetailsPage
              .getStopsSection()
              .getStopAreaHeader()
              .should('contain.text', 'Kuttulammentie');

            terminalDetailsPage
              .getStopsSection()
              .getStopAreaStopsTable()
              .shouldBeVisible();
            terminalDetailsPage
              .getStopsSection()
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

        terminalDetailsPage
          .getStopsSection()
          .getNthStopArea(0)
          .within(() => {
            terminalDetailsPage.getStopsSection().getStopAreaHeader().click();
          });

        cy.url().should('include', '/stop-registry/stop-areas/');
      },
    );
  });

  describe('info spots', () => {
    const infoSpotsViewCard = new TerminalInfoSpotsViewCard();
    const infoSpotsViewList = new TerminalInfoSpotsViewList();
    const infoSpotsRow = new TerminalInfoSpotRow();

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
  });
});
