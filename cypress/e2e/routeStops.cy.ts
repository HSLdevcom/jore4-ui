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
import { TimingSettingsForm } from '../pageObjects/TimingSettingsForm';
import { ViaForm } from '../pageObjects/ViaForm';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Line details page: stops on route', () => {
  let lineDetailsPage: LineDetailsPage;
  let toast: Toast;
  let lineRouteList: LineRouteList;
  let timingSettingsForm: TimingSettingsForm;

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

    lineDetailsPage = new LineDetailsPage();
    toast = new Toast();
    lineRouteList = new LineRouteList();
    timingSettingsForm = new TimingSettingsForm();

    cy.setupTests();
    cy.mockLogin();
  });

  it(
    'Verify that stops of route are shown on its list view',
    { tags: [Tag.Stops, Tag.Routes, Tag.Smoke] },
    () => {
      const { lineRouteListItem } = lineRouteList;
      const { routeRow } = lineRouteListItem;
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);

      lineRouteList.getLineRouteListItems().should('have.length', 2);
      lineRouteList.getNthLineRouteListItem(0).within(() => {
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
      lineRouteList.getShowUnusedStopsSwitch().click();
      lineRouteList.getNthLineRouteListItem(0).within(() => {
        lineRouteListItem.getRouteStopListItems().should('have.length', 5);
        lineRouteListItem
          .getNthRouteStopListItem(2)
          .should('contain', 'E2E003')
          .and('contain', 'Ei reitin käytössä');
      });
    },
  );

  it(
    'User can add stops to the route and remove them from the route',
    { tags: Tag.Stops },
    () => {
      const { lineRouteListItem } = lineRouteList;
      const { routeRow, routeStopListItem } = lineRouteListItem;
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);

      lineRouteList.getShowUnusedStopsSwitch().click();
      lineRouteList.getNthLineRouteListItem(0).within(() => {
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

      toast.expectSuccessToast('Reitti tallennettu');

      lineRouteList.getNthLineRouteListItem(0).within(() => {
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

      toast.expectSuccessToast('Reitti tallennettu');

      lineRouteList.getNthLineRouteListItem(0).within(() => {
        // Verify that E2E004 is no longer part of route
        lineRouteListItem
          .getNthRouteStopListItem(3)
          .should('contain', 'E2E004')
          .and('contain', 'Ei reitin käytössä');
      });
    },
  );

  it(
    'User cannot delete too many stops from route',
    { tags: Tag.Stops },
    () => {
      const { lineRouteListItem } = lineRouteList;
      const { routeRow, routeStopListItem } = lineRouteListItem;
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);

      // Show unused stops for clarity so that the length of the list
      // doesn't change while removing stops
      lineRouteList.getShowUnusedStopsSwitch().click();
      lineRouteList.getNthLineRouteListItem(0).within(() => {
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

      toast.expectDangerToast('Reitillä on oltava ainakin kaksi pysäkkiä.');
    },
  );

  it(
    'Should add Via info to a stop and then remove it',
    { tags: Tag.Stops },
    () => {
      const { lineRouteListItem } = lineRouteList;
      const { routeRow, routeStopListItem } = lineRouteListItem;
      const viaForm = new ViaForm();

      lineDetailsPage.visit(baseDbResources.lines[0].line_id);

      lineRouteList.getNthLineRouteListItem(0).within(() => {
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
      viaForm.getViaFinnishNameInput().type('Via-piste');
      viaForm.getViaSwedishNameInput().type('Via punkt');
      viaForm.getViaFinnishShortNameInput().type('Lyhyt nimi');
      viaForm.getViaSwedishShortNameInput().type('Kort namn');

      viaForm.getSaveButton().click();

      toast.expectSuccessToast('Via-tieto asetettu');

      // Check that via-icon exists and all info is saved
      lineRouteListItem.getNthRouteStopListItem(2).within(() => {
        routeStopListItem.getViaIcon().shouldBeVisible();
        routeStopListItem.getStopActionsDropdown().click();
        cy.withinHeadlessPortal(() =>
          routeStopListItem.stopActionsDropdown.getEditViaPointButton().click(),
        );
      });

      viaForm.getViaFinnishNameInput().should('have.value', 'Via-piste');
      viaForm.getViaSwedishNameInput().should('have.value', 'Via punkt');
      viaForm.getViaFinnishShortNameInput().should('have.value', 'Lyhyt nimi');
      viaForm.getViaSwedishShortNameInput().should('have.value', 'Kort namn');

      viaForm.getRemoveButton().click();
      toast.expectSuccessToast('Via-tieto poistettu');

      // Check that via-icon no longer exists and the create via button is visible
      lineRouteListItem.getNthRouteStopListItem(2).within(() => {
        routeStopListItem.getViaIcon().should('not.exist');
        routeStopListItem.getStopActionsDropdown().click();
      });
      routeStopListItem.stopActionsDropdown
        .getCreateViaPointButton()
        .shouldBeVisible();
    },
  );

  it(
    'Should add timing point to a stop and have correct options enabled/disabled',
    { tags: Tag.Stops },
    () => {
      const { lineRouteListItem } = lineRouteList;
      const { routeRow, routeStopListItem } = lineRouteListItem;
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);

      lineRouteList.getNthLineRouteListItem(0).within(() => {
        routeRow.getToggleAccordionButton().click();

        lineRouteListItem.getNthRouteStopListItem(2).within(() => {
          // Check that stop doesn't have hastus place set
          routeStopListItem.getHastusCode().should('not.exist');
          routeStopListItem.getOpenTimingSettingsButton().click();
        });
      });

      // No hastus place selected, therefore all checkboxes should be disabled
      timingSettingsForm
        .getTimingPlaceDropdown()
        .should('contain', 'Ei Hastus-paikkaa valittuna');
      timingSettingsForm.getIsUsedAsTimingPointCheckbox().shouldBeDisabled();
      timingSettingsForm.getIsRegulatedTimingPointCheckbox().shouldBeDisabled();
      timingSettingsForm.getIsLoadingTimeAllowedCheckbox().shouldBeDisabled();

      // Selecting a hastus place should enable only IsUsedAsTimingPoint checkbox
      timingSettingsForm.getTimingPlaceDropdownButton().type('1ALKU');
      timingSettingsForm.getTimingPlaceOptionByLabel('1ALKU').click();
      timingSettingsForm.getIsUsedAsTimingPointCheckbox().should('be.enabled');
      timingSettingsForm.getIsRegulatedTimingPointCheckbox().shouldBeDisabled();
      timingSettingsForm.getIsLoadingTimeAllowedCheckbox().shouldBeDisabled();

      // Checking IsUsedAsTimingPointCheckbox should enable IsRegulatedTimingPoint checkbox
      timingSettingsForm.getIsUsedAsTimingPointCheckbox().check();
      timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.enabled');
      timingSettingsForm.getIsLoadingTimeAllowedCheckbox().shouldBeDisabled();

      // And lastly checking IsRegulatedTimingPoint checkbox should enable IsLoadingTimeAllowed checkbox
      timingSettingsForm.getIsRegulatedTimingPointCheckbox().check();
      timingSettingsForm.getIsLoadingTimeAllowedCheckbox().should('be.enabled');

      timingSettingsForm.getIsLoadingTimeAllowedCheckbox().check();

      timingSettingsForm.getSavebutton().click();
      toast.expectSuccessToast('Aika-asetusten tallennus onnistui');

      lineRouteList.getNthLineRouteListItem(0).within(() => {
        lineRouteListItem.getNthRouteStopListItem(2).within(() => {
          routeStopListItem.getHastusCode().shouldHaveText('1ALKU');
          routeStopListItem.getOpenTimingSettingsButton().should('not.exist');
          routeStopListItem.getStopActionsDropdown().click();
        });
      });
      routeStopListItem.stopActionsDropdown
        .getOpenTimingSettingsButton()
        .click();

      timingSettingsForm.getTimingPlaceDropdown().should('contain', '1ALKU');
      timingSettingsForm.getIsUsedAsTimingPointCheckbox().should('be.checked');
      timingSettingsForm
        .getIsRegulatedTimingPointCheckbox()
        .should('be.checked');
      timingSettingsForm.getIsLoadingTimeAllowedCheckbox().should('be.checked');
    },
  );
});
