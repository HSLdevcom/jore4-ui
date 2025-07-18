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
  SelectMemberStopsDropdown,
  TerminalDetailsPage,
  Toast,
} from '../../pageObjects';
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
  const selectMemberStopsDropdown = new SelectMemberStopsDropdown();
  const externalLinks = new ExternalLinksSection();

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
  });

  describe('location details', () => {
    it('should view location details', { tags: [Tag.StopRegistry] }, () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.getPrivateCode().shouldHaveText('T2');

      verifyInitialLocationDetails();
    });

    function inputLocationDetails(inputs: ExpectedLocationDetails) {
      const { edit } = terminalDetailsPage.locationDetails;

      edit.getStreetAddress().clearAndType(inputs.streetAddress);
      edit.getPostalCode().clearAndType(inputs.postalCode);
      edit.getMunicipality().clearAndType(inputs.municipality);
      edit.getFareZone().clearAndType(inputs.fareZone);
    }

    it('should edit location details', { tags: [Tag.StopRegistry] }, () => {
      verifyInitialLocationDetails();

      const newLocationDetails: ExpectedLocationDetails = {
        streetAddress: 'New street address',
        postalCode: 'New postal code',
        municipality: 'New municipality',
        fareZone: 'New fare zone',
      };

      // Edit location details
      terminalDetailsPage.locationDetails.getEditButton().click();
      inputLocationDetails(newLocationDetails);
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
        selectMemberStopsDropdown.dropdownButton().click();
        selectMemberStopsDropdown.getInput().clearAndType('E2E009');
        selectMemberStopsDropdown.getMemberOptions().should('have.length', 1);
        selectMemberStopsDropdown
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
        selectMemberStopsDropdown.dropdownButton().click();
        selectMemberStopsDropdown
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
        selectMemberStopsDropdown.dropdownButton().click();
        selectMemberStopsDropdown
          .getSelectedMembers()
          .contains('E2E008')
          .click();
      });

      selectMemberStopsDropdown
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
});
