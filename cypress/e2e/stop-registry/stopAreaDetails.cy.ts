import {
  StopAreaInput,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
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
  AlternativeNames,
  BasicDetailsViewCard,
  ConfirmationDialog,
  SelectMemberStopsDropdown,
  StopAreaDetailsPage,
  StopDetailsPage,
  Toast,
} from '../../pageObjects';
import { DialogWithButtons } from '../../pageObjects/DialogWithButtons';
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
  readonly nameEng: string;
  readonly nameLongFin: string;
  readonly nameLongSwe: string;
  readonly nameLongEng: string;
  readonly abbreviationFin: string;
  readonly abbreviationSwe: string;
  readonly abbreviationEng: string;
  readonly privateCode: string;
  readonly areaSize: string;
  readonly parentTerminal: string;
  readonly validFrom: DateTime;
  readonly validTo: DateTime | null;
  readonly longitude: number;
  readonly latitude: number;
};

describe('Stop area details', () => {
  const stopAreaDetailsPage = new StopAreaDetailsPage();
  const alternativeNames = new AlternativeNames();
  const toast = new Toast();
  const selectMemberStopsDropdown = new SelectMemberStopsDropdown();

  let dbResources: SupportedResources;
  let dbIds: InsertedStopRegistryIds;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const stopAreaData: Array<StopAreaInput> = [
    {
      StopArea: {
        privateCode: { type: 'HSL/TEST', value: 'X0003' },
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
        privateCode: { type: 'HSL/TEST', value: 'X0004' },
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
      (name) => name?.nameType === 'translation' && name?.name.lang === 'swe',
    )?.name.value as string,
    nameEng: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'translation' && name?.name.lang === 'eng',
    )?.name.value as string,
    nameLongFin: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'alias' && name?.name.lang === 'fin',
    )?.name.value as string,
    nameLongSwe: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'alias' && name?.name.lang === 'swe',
    )?.name.value as string,
    nameLongEng: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'alias' && name?.name.lang === 'eng',
    )?.name.value as string,
    abbreviationFin: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'other' && name?.name.lang === 'fin',
    )?.name.value as string,
    abbreviationSwe: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'other' && name?.name.lang === 'swe',
    )?.name.value as string,
    abbreviationEng: testStopArea.StopArea.alternativeNames?.find(
      (name) => name?.nameType === 'other' && name?.name.lang === 'eng',
    )?.name.value as string,
    privateCode: testStopArea.StopArea.privateCode?.value as string,
    validFrom: testStopArea.StopArea.validBetween?.fromDate as DateTime,
    validTo: testStopArea.StopArea.validBetween?.toDate as DateTime,
    areaSize: '-',
    parentTerminal: '-',
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
    details.getNameSwe().shouldHaveText(expected.nameSwe);
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
    details.getPrivateCode().shouldHaveText(expected.privateCode);
    details.getAreaSize().shouldHaveText(expected.areaSize);
    details.getParentTerminal().shouldHaveText(expected.parentTerminal);
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

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should not allow editing multiple sections simultaneously', () => {
      // Initial state, edit buttons enabled
      assertEditButtonsEnabled();

      // Start editing details
      stopAreaDetailsPage.details.getEditButton().click();

      // Details save/edit enabled
      stopAreaDetailsPage.details.getEditButton().should('not.exist');
      stopAreaDetailsPage.details.edit.getCancelButton().shouldBeVisible();
      stopAreaDetailsPage.details.edit.getSaveButton().shouldBeVisible();
      stopAreaDetailsPage.details.edit
        .getPrivateCode()
        .shouldBeVisible()
        .shouldBeDisabled();
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

      edit.getName().clearAndType(inputs.name);
      edit.getNameSwe().clearAndType(inputs.nameSwe);
      edit.getNameEng().clearAndType(inputs.nameEng);
      edit.getNameLongFin().clearAndType(inputs.nameLongFin);
      edit.getNameLongSwe().clearAndType(inputs.nameLongSwe);
      edit.getNameLongEng().clearAndType(inputs.nameLongEng);
      edit.getAbbreviationFin().clearAndType(inputs.abbreviationFin);
      edit.getAbbreviationSwe().clearAndType(inputs.abbreviationSwe);
      edit.getAbbreviationEng().clearAndType(inputs.abbreviationEng);

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
        nameEng: 'New name eng',
        nameLongFin: 'New name long fin',
        nameLongSwe: 'New name long swe',
        nameLongEng: 'New name long eng',
        abbreviationFin: 'New abbreviation swe',
        abbreviationSwe: 'New abbreviation swe',
        abbreviationEng: 'New abbreviation eng',
        validFrom: DateTime.now(),
        validTo: null,
      };

      // Edit basic details
      stopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      stopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();

      // Commented out while editing member stops is disabled
      // assertEditButtonsEnabled();
      // Should have saved the changes and be back at view mode with new details
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

    it('should change name in all stop pages when editing stop area name', () => {
      stopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);

      stopAreaDetailsPage.details.getEditButton().click();
      stopAreaDetailsPage.details.edit.getName().clearAndType('uusinimi');
      stopAreaDetailsPage.details.edit.getSaveButton().click();

      const stopDetailsPage = new StopDetailsPage();
      const bdViewCard = new BasicDetailsViewCard();

      stopDetailsPage.visit('E2E001');
      stopDetailsPage.page().shouldBeVisible();
      bdViewCard.getAreaName().shouldHaveText('uusinimi');

      stopDetailsPage.visit('E2E009');
      stopDetailsPage.page().shouldBeVisible();
      bdViewCard.getAreaName().should('contain.text', 'uusinimi');
    });

    it('should handle deletion', () => {
      // Do not allow deletion when there are stops
      stopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);

      stopAreaDetailsPage.titleRow.getActionMenu().click();
      stopAreaDetailsPage.titleRow.getDeleteButton().click();
      const dialog = new DialogWithButtons();
      dialog
        .getTextContent()
        .contains(
          'Pysäkkialueeseen liittyy vielä pysäkkejä, eikä sitä voi siksi poistaa. Poista ensin alueeseen liittyvät pysäkit kokonaan tai siirrä ne johonkin toiseen pysäkkialueeseen.',
        );

      // Allow deletion when there are no stops
      stopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2ENQ);

      stopAreaDetailsPage.titleRow.getActionMenu().click();
      stopAreaDetailsPage.titleRow.getDeleteButton().click();
      const confirmationDialog = new ConfirmationDialog();

      confirmationDialog.getConfirmButton().click();
      cy.url().should('include', '/stop-registry');
    });
  });
});
