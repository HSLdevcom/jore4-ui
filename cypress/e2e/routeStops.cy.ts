import { buildStopInJourneyPattern } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  journeyPatterns,
  stopsInJourneyPattern901Inbound,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import { LineDetailsPage, LineRouteList, Toast } from '../pageObjects';
import { TimingSettingsForm } from '../pageObjects/forms/TimingSettingsForm';
import { ViaForm } from '../pageObjects/forms/ViaForm';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

const rootTags: Cypress.SuiteConfigOverrides = {
  tags: [Tag.Stops, Tag.Routes],
};
describe('Line details page: stops on route', rootTags, () => {
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      const stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      // Modify the 901 Outbound journey pattern so that E2E003 is not included
      dbResources = {
        ...baseDbResources,
        stopsInJourneyPattern: [
          ...stopsInJourneyPattern901Inbound,
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E001',
            scheduledStopPointSequence: 0,
            isUsedAsTimingPoint: true,
          }),
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E002',
            scheduledStopPointSequence: 1,
            isUsedAsTimingPoint: false,
          }),
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E004',
            scheduledStopPointSequence: 2,
            isUsedAsTimingPoint: false,
          }),
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E005',
            scheduledStopPointSequence: 3,
            isUsedAsTimingPoint: true,
          }),
        ],
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Verify that stops of route are shown on its list view',
    { tags: [Tag.Smoke] },
    () => {
      const { lineRouteListItem } = LineRouteList;
      const { routeRow } = lineRouteListItem;
      LineDetailsPage.visit(baseDbResources.lines[0].line_id);

      LineRouteList.getLineRouteListItems().should('have.length', 2);
      LineRouteList.getNthLineRouteListItem(0).within(() => {
        routeRow.directionBadge.getOutboundDirectionBadge().shouldBeVisible();
        routeRow.getToggleAccordionButton().click();

        // Verify that stops E2E001, E2E002, E2E004 and E2E005 are included on route,
        // but stop E2E003 is not included thus should not be shown by default
        lineRouteListItem.getRouteStopListItems().should('have.length', 4);
        lineRouteListItem
          .getNthRouteStopListItem(0)
          .should('contain', 'E2E001')
          .and('contain', 'Voimassa 20.3.2020 - 31.12.2050');

        lineRouteListItem
          .getNthRouteStopListItem(1)
          .should('contain', 'E2E002')
          .and('contain', 'Voimassa 20.3.2020 - 31.12.2050');

        lineRouteListItem
          .getNthRouteStopListItem(2)
          .should('contain', 'E2E004')
          .and('contain', 'Voimassa 20.3.2020 - 31.12.2050');

        lineRouteListItem
          .getNthRouteStopListItem(3)
          .should('contain', 'E2E005')
          .and('contain', 'Voimassa 20.3.2020 - 31.12.2050');
      });

      // Toggle show unused stops to see also the stop E2E003
      LineRouteList.getShowUnusedStopsSwitch().click();
      LineRouteList.getNthLineRouteListItem(0).within(() => {
        lineRouteListItem.getRouteStopListItems().should('have.length', 5);
        lineRouteListItem
          .getNthRouteStopListItem(2)
          .should('contain', 'E2E003')
          .and('contain', 'Ei reitin käytössä');
      });
    },
  );

  it('User can add stops to the route and remove them from the route', () => {
    const { lineRouteListItem } = LineRouteList;
    const { routeRow, routeStopListItem } = lineRouteListItem;
    LineDetailsPage.visit(baseDbResources.lines[0].line_id);

    LineRouteList.getShowUnusedStopsSwitch().click();
    LineRouteList.getNthLineRouteListItem(0).within(() => {
      routeRow.getToggleAccordionButton().click();

      lineRouteListItem
        .getNthRouteStopListItem(2)
        .should('contain', 'E2E003')
        .and('contain', 'Ei reitin käytössä');

      // Add E2E003 to the route
      lineRouteListItem.getNthRouteStopListItem(2).within(() => {
        routeStopListItem.getStopActionsDropdown().click();
        cy.withinHeadlessPortal(() =>
          routeStopListItem.stopActionsDropdown
            .getAddStopToRouteButton()
            .click(),
        );
      });
    });

    Toast.expectSuccessToast('Reitti tallennettu');

    LineRouteList.getNthLineRouteListItem(0).within(() => {
      // Verify that E2E003 is now part of the route
      lineRouteListItem
        .getNthRouteStopListItem(2)
        .should('contain', 'E2E003')
        .and('contain', 'Voimassa 20.3.2020 - 31.12.2050');

      // Then lets remove E2E004 from the route
      lineRouteListItem
        .getNthRouteStopListItem(3)
        .within(() =>
          routeStopListItem
            .getStopActionsDropdown()
            .should('be.enabled')
            .click(),
        );
    });
    routeStopListItem.stopActionsDropdown
      .getRemoveStopFromRouteButton()
      .should('be.enabled')
      .click();

    Toast.expectSuccessToast('Reitti tallennettu');

    LineRouteList.getNthLineRouteListItem(0).within(() => {
      // Verify that E2E004 is no longer part of route
      lineRouteListItem
        .getNthRouteStopListItem(3)
        .should('contain', 'E2E004')
        .and('contain', 'Ei reitin käytössä');
    });
  });

  it('User cannot delete too many stops from route', () => {
    const { lineRouteListItem } = LineRouteList;
    const { routeRow, routeStopListItem } = lineRouteListItem;
    LineDetailsPage.visit(baseDbResources.lines[0].line_id);

    // Show unused stops for clarity so that the length of the list
    // doesn't change while removing stops
    LineRouteList.getShowUnusedStopsSwitch().click();
    LineRouteList.getNthLineRouteListItem(0).within(() => {
      routeRow.getToggleAccordionButton().click();

      // Remove E2E002 from route
      lineRouteListItem.getNthRouteStopListItem(1).within(() => {
        routeStopListItem.getStopActionsDropdown().click();
        cy.withinHeadlessPortal(() =>
          routeStopListItem.stopActionsDropdown
            .getRemoveStopFromRouteButton()
            .click(),
        );
      });
      lineRouteListItem
        .getNthRouteStopListItem(1)
        .should('contain', 'E2E002')
        .and('contain', 'Ei reitin käytössä');

      // Remove E2E004 from route
      lineRouteListItem.getNthRouteStopListItem(3).within(() => {
        routeStopListItem.getStopActionsDropdown().click();
        cy.withinHeadlessPortal(() =>
          routeStopListItem.stopActionsDropdown
            .getRemoveStopFromRouteButton()
            .click(),
        );
      });
      lineRouteListItem
        .getNthRouteStopListItem(3)
        .should('contain', 'E2E004')
        .and('contain', 'Ei reitin käytössä');

      // Try to remove E2E005 from route
      lineRouteListItem.getNthRouteStopListItem(4).within(() => {
        routeStopListItem.getStopActionsDropdown().click();
        cy.withinHeadlessPortal(() =>
          routeStopListItem.stopActionsDropdown
            .getRemoveStopFromRouteButton()
            .click(),
        );
      });
    });

    Toast.expectDangerToast('Reitillä on oltava ainakin kaksi pysäkkiä.');
  });

  it('Should add Via info to a stop and then remove it', () => {
    const { lineRouteListItem } = LineRouteList;
    const { routeRow, routeStopListItem } = lineRouteListItem;

    LineDetailsPage.visit(baseDbResources.lines[0].line_id);

    LineRouteList.getNthLineRouteListItem(0).within(() => {
      routeRow.getToggleAccordionButton().click();

      // Create via point to stop E2E004
      lineRouteListItem.getNthRouteStopListItem(2).within(() => {
        // Check that via-icon does not exist
        routeStopListItem.getViaIcon().should('not.exist');
        routeStopListItem.getStopActionsDropdown().click();
      });
    });
    routeStopListItem.stopActionsDropdown.getCreateViaPointButton().click();

    // Input via info to form
    ViaForm.getViaFinnishNameInput().type('Via-piste');
    ViaForm.getViaSwedishNameInput().type('Via punkt');
    ViaForm.getViaFinnishShortNameInput().type('Lyhyt nimi');
    ViaForm.getViaSwedishShortNameInput().type('Kort namn');

    ViaForm.getSaveButton().click();

    Toast.expectSuccessToast('Via-tieto asetettu');

    // Check that via-icon exists and all info is saved
    lineRouteListItem.getNthRouteStopListItem(2).within(() => {
      routeStopListItem.getViaIcon().shouldBeVisible();
      routeStopListItem.getStopActionsDropdown().click();
      cy.withinHeadlessPortal(() =>
        routeStopListItem.stopActionsDropdown.getEditViaPointButton().click(),
      );
    });

    ViaForm.getViaFinnishNameInput().should('have.value', 'Via-piste');
    ViaForm.getViaSwedishNameInput().should('have.value', 'Via punkt');
    ViaForm.getViaFinnishShortNameInput().should('have.value', 'Lyhyt nimi');
    ViaForm.getViaSwedishShortNameInput().should('have.value', 'Kort namn');

    ViaForm.getRemoveButton().click();
    Toast.expectSuccessToast('Via-tieto poistettu');

    // Check that via-icon no longer exists and the create via button is visible
    lineRouteListItem.getNthRouteStopListItem(2).within(() => {
      routeStopListItem.getViaIcon().should('not.exist');
      routeStopListItem.getStopActionsDropdown().click();
    });
    routeStopListItem.stopActionsDropdown
      .getCreateViaPointButton()
      .shouldBeVisible();
  });

  it('Should add timing point to a stop and have correct options enabled/disabled', () => {
    const { lineRouteListItem } = LineRouteList;
    const { routeRow, routeStopListItem } = lineRouteListItem;
    LineDetailsPage.visit(baseDbResources.lines[0].line_id);

    LineRouteList.getNthLineRouteListItem(0).within(() => {
      routeRow.getToggleAccordionButton().click();

      lineRouteListItem.getNthRouteStopListItem(2).within(() => {
        // Check that stop doesn't have hastus place set
        routeStopListItem.getHastusCode().should('not.exist');
        routeStopListItem.getOpenTimingSettingsButton().click();
      });
    });

    // No hastus place selected, therefore all checkboxes should be disabled
    TimingSettingsForm.getTimingPlaceDropdown().should(
      'contain',
      'Ei Hastus-paikkaa valittuna',
    );
    TimingSettingsForm.getIsUsedAsTimingPointCheckbox().shouldBeDisabled();
    TimingSettingsForm.getIsRegulatedTimingPointCheckbox().shouldBeDisabled();
    TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().shouldBeDisabled();

    // Selecting a hastus place should enable only IsUsedAsTimingPoint checkbox
    TimingSettingsForm.getTimingPlaceDropdownButton().type('1ALKU');
    TimingSettingsForm.getTimingPlaceOptionByLabel('1ALKU').click();
    TimingSettingsForm.getIsUsedAsTimingPointCheckbox().should('be.enabled');
    TimingSettingsForm.getIsRegulatedTimingPointCheckbox().shouldBeDisabled();
    TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().shouldBeDisabled();

    // Checking IsUsedAsTimingPointCheckbox should enable IsRegulatedTimingPoint checkbox
    TimingSettingsForm.getIsUsedAsTimingPointCheckbox().check();
    TimingSettingsForm.getIsRegulatedTimingPointCheckbox().should('be.enabled');
    TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().shouldBeDisabled();

    // And lastly checking IsRegulatedTimingPoint checkbox should enable IsLoadingTimeAllowed checkbox
    TimingSettingsForm.getIsRegulatedTimingPointCheckbox().check();
    TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().should('be.enabled');

    TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().check();

    TimingSettingsForm.getSavebutton().click();
    Toast.expectSuccessToast('Aika-asetusten tallennus onnistui');

    LineRouteList.getNthLineRouteListItem(0).within(() => {
      lineRouteListItem.getNthRouteStopListItem(2).within(() => {
        routeStopListItem.getHastusCode().shouldHaveText('1ALKU');
        routeStopListItem.getOpenTimingSettingsButton().should('not.exist');
        routeStopListItem.getStopActionsDropdown().click();
      });
    });
    routeStopListItem.stopActionsDropdown.getOpenTimingSettingsButton().click();

    TimingSettingsForm.getTimingPlaceDropdown().should('contain', '1ALKU');
    TimingSettingsForm.getIsUsedAsTimingPointCheckbox().should('be.checked');
    TimingSettingsForm.getIsRegulatedTimingPointCheckbox().should('be.checked');
    TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().should('be.checked');
  });
});
