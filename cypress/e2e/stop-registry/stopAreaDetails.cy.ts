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
  AlternativeNamesEdit,
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
          .should(
            'have.attr',
            'href',
            `/stop-registry/stops/${label}?observationDate=${DateTime.now().toISODate()}&priority=10`,
          );

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

    function waitForSaveToBeFinished() {
      expectGraphQLCallToSucceed('@gqlUpsertStopArea');
      toast.expectSuccessToast('Pysäkkialue muokattu');
    }

    function inputBasicDetails(inputs: ExpectedBasicDetails) {
      const { edit } = stopAreaDetailsPage.details;
      const altEdit = new AlternativeNamesEdit();

      edit.getName().clearAndType(inputs.name);
      edit.getNameSwe().clearAndType(inputs.nameSwe);
      altEdit.getNameEng().clearAndType(inputs.nameEng);
      altEdit.getNameLongFin().clearAndType(inputs.nameLongFin);
      altEdit.getNameLongSwe().clearAndType(inputs.nameLongSwe);
      altEdit.getNameLongEng().clearAndType(inputs.nameLongEng);
      altEdit.getAbbreviationFin().clearAndType(inputs.abbreviationFin);
      altEdit.getAbbreviationSwe().clearAndType(inputs.abbreviationSwe);
      altEdit.getAbbreviationEng().clearAndType(inputs.abbreviationEng);

      setValidity(inputs.validFrom, inputs.validTo);
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

      // Should have saved the changes and be back at view mode with new details
      assertBasicDetails(newBasicDetails);

      // And the basic details should still match newBasicDetails
      assertBasicDetails(newBasicDetails);
    });

    it('should allow moving member stop to the stop area', () => {
      stopAreaDetailsPage.memberStops.getAddStopButton().click();
      stopAreaDetailsPage.memberStops.modal.modal().shouldBeVisible();
      selectMemberStopsDropdown.dropdownButton().click();
      selectMemberStopsDropdown.getInput().click();
      selectMemberStopsDropdown.getInput().clearAndType('E2E003');
      selectMemberStopsDropdown.getMemberOptions().should('have.length', 1);
      selectMemberStopsDropdown
        .getMemberOptions()
        .eq(0)
        .should('contain.text', 'E2E003')
        .click();

      stopAreaDetailsPage.memberStops.modal
        .getTransferDateInput()
        .shouldBeVisible();
      stopAreaDetailsPage.memberStops.modal.setTransferDate(
        DateTime.now().toISODate() ?? '',
      );
      stopAreaDetailsPage.memberStops.modal.getStopVersionsButton().click();

      stopAreaDetailsPage.memberStops.modal
        .getStopVersionsList()
        .shouldBeVisible();

      stopAreaDetailsPage.memberStops.modal.saveButton().click();

      // All stops should be present in the end
      stopAreaDetailsPage.memberStops.getStopRow('E2E001').shouldBeVisible();
      stopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      stopAreaDetailsPage.memberStops.getStopRow('E2E009').shouldBeVisible();
    });

    it('should not find member stop to move to the stop area if it already is in the stop area', () => {
      stopAreaDetailsPage.memberStops.getAddStopButton().click();
      stopAreaDetailsPage.memberStops.modal.modal().shouldBeVisible();
      selectMemberStopsDropdown.dropdownButton().click();
      selectMemberStopsDropdown.getInput().click();
      selectMemberStopsDropdown.getInput().clearAndType('E2E001');
      selectMemberStopsDropdown.getMemberOptions().should('have.length', 0);
      stopAreaDetailsPage.memberStops.modal.saveButton().should('be.disabled');
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

    it('should show no stops text on stop area without stops', () => {
      // Check that the text is shown on the stop area without stops
      stopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2ENQ);

      stopAreaDetailsPage.details
        .getNoStopsText()
        .shouldHaveText('Ei pysäkkejä.');
    });
  });
});
