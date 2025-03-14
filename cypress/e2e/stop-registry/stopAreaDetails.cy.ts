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
  Annankatu15AltNames,
  getClonedBaseStopRegistryData,
} from '../../datasets/stopRegistry';
import {
  BasicDetailsForm,
  BasicDetailsViewCard,
  SelectMemberStopsDropdown,
  StopAreaDetailsPage,
  StopDetailsPage,
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
  readonly nameSwe: string;
  readonly privateCode: string;
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
  let dbIds: InsertedStopRegistryIds;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const stopAreaData: Array<StopAreaInput> = [
    {
      StopArea: {
        privateCode: { type: 'HSL', value: 'X0003' },
        name: { lang: 'fin', value: 'Annankatu 15' },
        alternativeNames: Annankatu15AltNames,
        validBetween: {
          fromDate: DateTime.fromISO('2000-01-01'),
          toDate: DateTime.fromISO('2052-01-01'),
        },
        geometry: {
          coordinates: [24.938927, 60.165433],
          type: StopRegistryGeoJsonType.Point,
        },
        organisations: [],
        quays: [
          {
            publicCode: 'E2E001',
          },
          {
            publicCode: 'E2E009',
          },
        ],
      },
      organisations: null,
    },
    {
      StopArea: {
        privateCode: { type: 'HSL', value: 'X0004' },
        name: { lang: 'fin', value: 'Kalevankatu 32' },
        keyValues: [
          { key: 'validityStart', values: ['2000-01-01'] },
          { key: 'validityEnd', values: ['2052-01-01'] },
        ],
        geometry: {
          coordinates: [24.932914978884, 60.165538996581],
          type: StopRegistryGeoJsonType.Point,
        },
        quays: [
          {
            publicCode: 'E2E003',
            keyValues: [
              { key: 'streetAddress', values: ['Kalevankatu 32'] },
              { key: 'elyNumber', values: ['E2E003'] },
            ],
          },
          {
            publicCode: 'E2E006',
            keyValues: [
              { key: 'streetAddress', values: ['Kalevankatu 32'] },
              { key: 'elyNumber', values: ['E2E006'] },
            ],
          },
        ],
      },
      organisations: null,
    },
  ];

  const [testStopArea] = stopAreaData;

  const testAreaExpectedBasicDetails: ExpectedBasicDetails = {
    name: testStopArea.StopArea.name?.value as string,
    nameSwe: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'translation',
    )?.name.value as string,
    privateCode: testStopArea.StopArea.privateCode?.value as string,
    validFrom: testStopArea.StopArea.validBetween?.fromDate as DateTime,
    validTo: testStopArea.StopArea.validBetween?.toDate as DateTime,
    areaSize: '-',
    parentStopPlace: '-',
    longitude: testStopArea.StopArea.geometry?.coordinates[0],
    latitude: testStopArea.StopArea.geometry?.coordinates[1],
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
    }).then((data) => {
      dbIds = data;
      const id = data.stopPlaceIdsByName.X0003;

      cy.setupTests();
      cy.mockLogin();

      stopAreaDetailsPage.visit(id);
    });
  });

  function assertBasicDetails(expected: ExpectedBasicDetails) {
    stopAreaDetailsPage.titleRow
      .getPrivateCode()
      .shouldHaveText(expected.privateCode);
    stopAreaDetailsPage.titleRow.getName().shouldHaveText(expected.name);

    const validity = `${mapToShortDate(expected.validFrom)}-${mapToShortDate(expected.validTo)}`;

    stopAreaDetailsPage.versioningRow
      .getValidityPeriod()
      .shouldHaveText(validity);

    const { details } = stopAreaDetailsPage;
    details.getName().shouldHaveText(expected.name);
    details.getPrivateCode().shouldHaveText(expected.privateCode);
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
      stopAreaDetailsPage.details.edit.getPrivateCode().shouldBeVisible();
      stopAreaDetailsPage.details.edit.getName().shouldBeVisible();
      stopAreaDetailsPage.details.edit.getNameSwe().shouldBeVisible();
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
    }

    function inputBasicDetails(inputs: ExpectedBasicDetails) {
      const { edit } = stopAreaDetailsPage.details;

      edit.getPrivateCode().clearAndType(inputs.privateCode);
      edit.getName().clearAndType(inputs.name);
      edit.getNameSwe().clearAndType(inputs.nameSwe);

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

    it('should allow editing details', () => {
      assertBasicDetails(testAreaExpectedBasicDetails);

      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        name: 'New name',
        nameSwe: 'New name swe',
        privateCode: 'New private code',
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

      // And the basic details should still match newBasicDetails
      assertBasicDetails(newBasicDetails);
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should allow editing members', () => {
      assertBasicDetails(testAreaExpectedBasicDetails);

      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        name: 'New name',
        nameSwe: 'New name swe',
        privateCode: 'New private code',
        validFrom: DateTime.now(),
        validTo: null,
      };

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
        stopAreaData?.find(
          (d) => d.StopArea?.name?.value !== testStopArea.StopArea.name?.value,
        )?.StopArea?.name?.value ?? 'noop';

      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        name: existingLabel,
      };

      assertBasicDetails(testAreaExpectedBasicDetails);
      stopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      stopAreaDetailsPage.details.edit.getSaveButton().click();
      toast.expectDangerToast(
        'Pysäkkialueella tulee olla uniikki nimi, mutta nimi Kalevankatu 32 on jo jonkin toisen alueen käytössä!',
      );
      expectGraphQLCallToReturnError('@gqlUpsertStopArea');
    });

    it('should handle unique private code exception', () => {
      const existingPrivateCode =
        stopAreaData?.find(
          (d) =>
            d.StopArea?.privateCode?.value !==
            testStopArea.StopArea.privateCode?.value,
        )?.StopArea?.privateCode?.value ?? 'noop';
      const newBasicDetails: ExpectedBasicDetails = {
        ...testAreaExpectedBasicDetails,
        privateCode: existingPrivateCode,
      };

      assertBasicDetails(testAreaExpectedBasicDetails);
      stopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      stopAreaDetailsPage.details.edit.getSaveButton().click();
      toast.expectDangerToast(
        'Pysäkkialueella tulee olla uniikki tunnus, mutta tunnus X0004 on jo jonkin toisen alueen käytössä!',
      );
      expectGraphQLCallToReturnError('@gqlUpsertStopArea');
    });

    it('should change all stop names when editing one stop name', () => {
      stopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);

      // When editing Basic details
      stopAreaDetailsPage.details.getEditButton().click();
      // Can't test properly as we are missing most of the name fields.
      /*
      stopAreaDetailsPage.nameConsistencyChecker.assertIsConsistent();
      stopAreaDetailsPage.details.edit.getName().clearAndType('New name');
       */
      stopAreaDetailsPage.nameConsistencyChecker.assertIsInconsistent();
      stopAreaDetailsPage.details.edit.getCancelButton().click();

      // When editing member stop's names
      const stopDetailsPage = new StopDetailsPage();
      const bdViewCard = new BasicDetailsViewCard();
      const bdForm = new BasicDetailsForm();
      stopDetailsPage.visit('E2E001');
      stopDetailsPage.page().shouldBeVisible();
      stopDetailsPage.basicDetails.getEditButton().click();

      bdForm.getNameFinInput().clearAndType('uusinimi');
      bdForm.getPrivateCodeInput().clearAndType('label');
      bdForm.getStopPlaceStateDropdownButton().click();
      bdForm.getStopPlaceStateDropdownOptions().contains('Käytössä').click();
      stopDetailsPage.basicDetails.getSaveButton().click();
      bdViewCard.getNameFin().shouldBeVisible();

      stopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);
      stopAreaDetailsPage.details.getName().should('contain.text', 'uusinimi');

      stopDetailsPage.visit('E2E009');
      stopDetailsPage.page().shouldBeVisible();
      bdViewCard.getNameFin().should('contain.text', 'uusinimi');
    });
  });
});
