import {
  StopAreaInput,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import {
  getClonedBaseStopRegistryData,
  stopAreaX0003,
} from '../../datasets/stopRegistry';
import {
  SelectMemberStopsDropdown,
  StopAreaDetailsPage,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import {
  expectGraphQLCallToReturnError,
  expectGraphQLCallToSucceed,
} from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

function mapToShortDate(date: DateTime | null) {
  if (!date) {
    return '';
  }

  return date.setLocale('fi').toFormat('d.L.yyyy');
}

type ExpectedBasicDetails = {
  readonly name: string;
  readonly description: string;
  readonly parentStopPlace: string;
  readonly areaSize: string;
  readonly validFrom: DateTime;
  readonly validTo: DateTime | null;
  readonly longitude: number;
  readonly latitude: number;
};

describe('Stop area details', () => {
  const stopAreaDetailsPage = new StopAreaDetailsPage();
  const toast = new Toast();
  const selectMemberStopsDropdown = new SelectMemberStopsDropdown();

  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const testStopArea = { ...stopAreaX0003 };
  const stopAreaData: Array<StopAreaInput> = [
    testStopArea,
    {
      memberLabels: ['E2E002', 'E2E008'],
      stopArea: {
        name: { lang: 'fin', value: 'X0004' },
        description: { lang: 'fin', value: 'Annankatu 16' },
        validBetween: {
          fromDate: DateTime.fromISO('2020-01-01T00:00:00.001'),
          toDate: DateTime.fromISO('2050-01-01T00:00:00.001'),
        },
        geometry: {
          coordinates: [24.838928, 60.165434],
          type: StopRegistryGeoJsonType.Point,
        },
      },
    },
  ];

  const testAreaExpectedBasicDetails: ExpectedBasicDetails = {
    name: testStopArea.stopArea.name.value,
    description: testStopArea.stopArea.description.value,
    validFrom: testStopArea.stopArea.validBetween.fromDate,
    validTo: testStopArea.stopArea.validBetween.toDate,
    areaSize: '-',
    parentStopPlace: '-',
    longitude: testStopArea.stopArea.geometry.coordinates[0],
    latitude: testStopArea.stopArea.geometry.coordinates[1],
  };

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
      stopAreas: stopAreaData,
    }).then((data) => {
      const id = data.stopAreaIdsByName.X0003;

      cy.setupTests();
      cy.mockLogin();

      stopAreaDetailsPage.visit(id);
    });
  });

  function assertBasicDetails(expected: ExpectedBasicDetails) {
    stopAreaDetailsPage.titleRow.getName().shouldHaveText(expected.name);
    stopAreaDetailsPage.titleRow
      .getDescription()
      .shouldHaveText(expected.description);

    const validity = `${mapToShortDate(expected.validFrom)}-${mapToShortDate(expected.validTo)}`;
    stopAreaDetailsPage.versioningRow
      .getValidityPeriod()
      .shouldHaveText(validity);

    const { details } = stopAreaDetailsPage;
    details.getName().shouldHaveText(expected.name);
    details.getDescription().shouldHaveText(expected.description);
    details.getParentStopPlace().shouldHaveText(expected.parentStopPlace);
    details.getAreaSize().shouldHaveText(expected.areaSize);
    details.getValidityPeriod().shouldHaveText(validity);

    stopAreaDetailsPage.minimap
      .getMarker()
      .should('have.attr', 'data-longitude', expected.longitude)
      .should('have.attr', 'data-latitude', expected.latitude);
  }

  describe('View basic details', () => {
    function testMemberStopRow(label: string) {
      const { memberStops } = stopAreaDetailsPage;

      memberStops.getStopRow(label).shouldBeVisible();

      memberStops.getStopRow(label).within(() => {
        memberStops
          .getLink()
          .shouldBeVisible()
          .should('have.attr', 'href', `/stop-registry/stops/${label}`);

        memberStops.getShowOnMapButton().shouldBeVisible();

        memberStops.getActionMenu().click();
        memberStops
          .getShowStopDetailsMenuItem()
          .shouldBeVisible()
          .shouldHaveText('Näytä pysäkin tiedot');
        memberStops
          .getShowOnMapMenuItem()
          .shouldBeVisible()
          .shouldHaveText('Näytä pysäkki kartalla');
        memberStops
          .getRemoveStopMenuItem()
          .shouldBeVisible()
          .shouldHaveText('Poista pysäkki pysäkkialueelta');
        memberStops.getActionMenu().click();
      });
    }

    it('should have basic info', () => {
      assertBasicDetails(testAreaExpectedBasicDetails);

      testMemberStopRow('E2E001');
      testMemberStopRow('E2E009');
    });
  });

  describe('Editing', () => {
    function assertEditButtonsEnabled() {
      stopAreaDetailsPage.details
        .getEditButton()
        .shouldBeVisible()
        .should('not.be.disabled');

      stopAreaDetailsPage.memberStops
        .getAddStopButton()
        .shouldBeVisible()
        .should('not.be.disabled');
    }

    function setValidity(from: DateTime, to: DateTime | null) {
      stopAreaDetailsPage.details.edit.validity.setStartDate(
        from.toISODate() ?? '',
      );
      if (to) {
        stopAreaDetailsPage.details.edit.validity.setAsIndefinite(false);
        stopAreaDetailsPage.details.edit.validity.setEndDate(
          to.toISODate() ?? '',
        );
      } else {
        stopAreaDetailsPage.details.edit.validity.setAsIndefinite(true);
      }
    }

    it('should not allow editing multiple sections simultaneously', () => {
      // Initial state, edit buttons enabled
      assertEditButtonsEnabled();

      // Start editing details
      stopAreaDetailsPage.details.getEditButton().click();

      // Details save/edit enabled
      stopAreaDetailsPage.details.getEditButton().should('not.exist');
      stopAreaDetailsPage.details.edit.getCancelButton().shouldBeVisible();
      stopAreaDetailsPage.details.edit.getSaveButton().shouldBeVisible();
      stopAreaDetailsPage.details.edit.getLabel().shouldBeVisible();
      stopAreaDetailsPage.details.edit.getName().shouldBeVisible();
      stopAreaDetailsPage.details.edit
        .getLongitude()
        .shouldBeVisible()
        .shouldBeDisabled();
      stopAreaDetailsPage.details.edit
        .getLatitude()
        .shouldBeVisible()
        .shouldBeDisabled();
      stopAreaDetailsPage.details.edit.validity
        .getStartDateInput()
        .shouldBeVisible();
      stopAreaDetailsPage.details.edit.validity
        .getEndDateInput()
        .shouldBeVisible();
      stopAreaDetailsPage.details.edit.validity
        .getIndefiniteCheckbox()
        .shouldBeVisible();

      // Member stops no editing available
      stopAreaDetailsPage.memberStops.getAddStopButton().should('not.exist');
      stopAreaDetailsPage.memberStops.getCancelButton().should('not.exist');
      stopAreaDetailsPage.memberStops.getSaveButton().should('not.exist');
      stopAreaDetailsPage.memberStops
        .getSelectMemberStops()
        .should('not.exist');

      // Cancel editing details & Start editing members
      stopAreaDetailsPage.details.edit.getCancelButton().click();
      assertEditButtonsEnabled();
      stopAreaDetailsPage.memberStops.getAddStopButton().click();

      // Member stop editing enabled
      stopAreaDetailsPage.memberStops.getAddStopButton().should('not.exist');
      stopAreaDetailsPage.memberStops.getCancelButton().shouldBeVisible();
      stopAreaDetailsPage.memberStops.getSaveButton().shouldBeVisible();
      stopAreaDetailsPage.memberStops.getSelectMemberStops().shouldBeVisible();

      // Details editing disabled
      stopAreaDetailsPage.details.getEditButton().should('not.exist');
      stopAreaDetailsPage.details.edit.getCancelButton().should('not.exist');
      stopAreaDetailsPage.details.edit.getSaveButton().should('not.exist');

      // Cancel editing members
      stopAreaDetailsPage.memberStops.getCancelButton().click();
      assertEditButtonsEnabled();
    });

    function waitForSaveToBeFinished() {
      expectGraphQLCallToSucceed('@gqlUpsertStopArea');
      toast.expectSuccessToast('Pysäkkialue muokattu');
      toast.getSuccessToast().should('not.exist');
    }

    function inputBasicDetails(inputs: ExpectedBasicDetails) {
      const { edit } = stopAreaDetailsPage.details;

      edit.getLabel().clearAndType(inputs.name);
      edit.getName().clearAndType(inputs.description);

      setValidity(inputs.validFrom, inputs.validTo);
    }

    function testMemberStopEditing() {
      // Remove stop E2E009
      stopAreaDetailsPage.memberStops.getAddStopButton().click();
      // Test remove/add back
      stopAreaDetailsPage.memberStops.getStopRow('E2E001').within(() => {
        stopAreaDetailsPage.memberStops.getRemoveButton().click();
        stopAreaDetailsPage.memberStops.getAddBackButton().click();
      });
      stopAreaDetailsPage.memberStops.getStopRow('E2E009').within(() => {
        stopAreaDetailsPage.memberStops.getRemoveButton().click();
      });
      stopAreaDetailsPage.memberStops.getSaveButton().click();
      waitForSaveToBeFinished();
      stopAreaDetailsPage.memberStops.getStopRow('E2E009').should('not.exist');
      assertEditButtonsEnabled();

      // Find and add back stop E2E009
      stopAreaDetailsPage.memberStops.getAddStopButton().click();
      stopAreaDetailsPage.memberStops.getSelectMemberStops().within(() => {
        selectMemberStopsDropdown.dropdownButton().click();
        selectMemberStopsDropdown.getInput().clearAndType('E2E009');
        selectMemberStopsDropdown.getMemberOptions().should('have.length', 1);
        selectMemberStopsDropdown
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'E2E009')
          .click();
      });
      stopAreaDetailsPage.memberStops.getSaveButton().click();
      waitForSaveToBeFinished();
    }

    it('should allow editing details & members', () => {
      assertBasicDetails(testAreaExpectedBasicDetails);

      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        name: 'New name',
        description: 'New description',
        validFrom: DateTime.now(),
        validTo: null,
      };

      // Edit basic details
      stopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      stopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();

      // Should have saved the changes and be back at view mode with new details
      assertEditButtonsEnabled();
      assertBasicDetails(newBasicDetails);

      // Edit member stops
      testMemberStopEditing();

      // Both stops should be present in the end
      stopAreaDetailsPage.memberStops.getStopRow('E2E001').shouldBeVisible();
      stopAreaDetailsPage.memberStops.getStopRow('E2E009').shouldBeVisible();

      // And the basic details should still match newBasicDetails
      assertBasicDetails(newBasicDetails);
    });

    it('should handle unique name exception', () => {
      const existingLabel =
        stopAreaData?.at(1)?.stopArea?.name?.value ?? 'noop';
      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        name: existingLabel,
      };

      assertBasicDetails(testAreaExpectedBasicDetails);
      stopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      stopAreaDetailsPage.details.edit.getSaveButton().click();
      toast.checkDangerToastHasMessage(
        'Pysäkkialueella tulee olla uniikki tunnus, mutta tunnus X0004 on jo jonkin toisen alueen käytössä!',
      );
      expectGraphQLCallToReturnError('@gqlUpsertStopArea');
    });

    it('should handle unique description exception', () => {
      const existingDescription =
        stopAreaData?.at(1)?.stopArea?.description?.value ?? 'noop';
      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        description: existingDescription,
      };

      assertBasicDetails(testAreaExpectedBasicDetails);
      stopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      stopAreaDetailsPage.details.edit.getSaveButton().click();
      toast.checkDangerToastHasMessage(
        'Pysäkkialueella tulee olla uniikki nimi, mutta nimi Annankatu 16 on jo jonkin toisen alueen käytössä!',
      );
      expectGraphQLCallToReturnError('@gqlUpsertStopArea');
    });
  });
});
