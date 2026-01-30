import {
  KnownValueKey,
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
import { Tag } from '../../enums';
import {
  AlternativeNames,
  AlternativeNamesEdit,
  BasicDetailsViewCard,
  ConfirmationDialog,
  SelectStopDropdown,
  StopAreaDetailsPage,
  StopDetailsPage,
  Toast,
} from '../../pageObjects';
import { DialogWithButtons } from '../../pageObjects/shared-components/DialogWithButtons';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
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

describe('Stop area details', { tags: Tag.StopRegistry }, () => {
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
          { key: KnownValueKey.ValidityStart, values: ['2000-01-01'] },
          { key: KnownValueKey.ValidityEnd, values: ['2052-01-01'] },
        ],
        geometry: {
          coordinates: [24.932914978884, 60.165538996581],
          type: StopRegistryGeoJsonType.Point,
        },
        quays: [
          {
            publicCode: 'E2E003',
            keyValues: [
              {
                key: KnownValueKey.StreetAddress,
                values: ['Kalevankatu 32'],
              },
              { key: KnownValueKey.ElyNumber, values: ['E2E003'] },
            ],
          },
          {
            publicCode: 'E2E006',
            keyValues: [
              {
                key: KnownValueKey.StreetAddress,
                values: ['Kalevankatu 32'],
              },
              { key: KnownValueKey.ElyNumber, values: ['E2E006'] },
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
    longitude: testStopArea.StopArea.geometry?.coordinates?.at(0) ?? 0,
    latitude: testStopArea.StopArea.geometry?.coordinates?.at(1) ?? 0,
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

      StopAreaDetailsPage.visit(id);
    });
  });

  function assertBasicDetails(expected: ExpectedBasicDetails) {
    StopAreaDetailsPage.titleRow
      .getPrivateCode()
      .shouldHaveText(expected.privateCode);
    StopAreaDetailsPage.titleRow.getName().shouldHaveText(expected.name);

    const validity = `${mapToShortDate(expected.validFrom)}-${mapToShortDate(expected.validTo)}`;

    StopAreaDetailsPage.versioningRow
      .getValidityPeriod()
      .shouldHaveText(validity);

    StopAreaDetailsPage.versioningRow
      .getChangeHistoryLink()
      .shouldBeVisible()
      .invoke('text')
      .should('match', /\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}/); // Matches format: DD.MM.YYYY HH:mm

    const { details } = StopAreaDetailsPage;
    details.getName().shouldHaveText(expected.name);
    details.getNameSwe().shouldHaveText(expected.nameSwe);
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
    details.getPrivateCode().shouldHaveText(expected.privateCode);
    details.getAreaSize().shouldHaveText(expected.areaSize);
    details.getParentTerminal().shouldHaveText(expected.parentTerminal);
    details.getValidityPeriod().shouldHaveText(validity);

    StopAreaDetailsPage.minimap
      .getMarker()
      .should('have.attr', 'data-longitude', expected.longitude)
      .should('have.attr', 'data-latitude', expected.latitude);
  }

  describe('View basic details', { tags: [Tag.Map, Tag.Smoke] }, () => {
    function testMemberStopRow(label: string) {
      const { memberStops } = StopAreaDetailsPage;

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
      });

      memberStops
        .getShowStopDetailsMenuItem()
        .shouldBeVisible()
        .shouldHaveText('Näytä pysäkin tiedot');
      memberStops
        .getShowOnMapMenuItem()
        .shouldBeVisible()
        .shouldHaveText('Näytä pysäkki kartalla');
      cy.closeDropdown();
    }

    it('should have basic info', () => {
      assertBasicDetails(testAreaExpectedBasicDetails);

      testMemberStopRow('E2E001');
      testMemberStopRow('E2E009');
    });
  });

  describe('Editing', () => {
    function setValidity(from: DateTime, to: DateTime | null) {
      StopAreaDetailsPage.details.edit.validity.setStartDate(
        from.toISODate() ?? '',
      );
      if (to) {
        StopAreaDetailsPage.details.edit.validity.setAsIndefinite(false);
        StopAreaDetailsPage.details.edit.validity.setEndDate(
          to.toISODate() ?? '',
        );
      } else {
        StopAreaDetailsPage.details.edit.validity.setAsIndefinite(true);
      }
    }

    function waitForSaveToBeFinished() {
      expectGraphQLCallToSucceed('@gqlUpsertStopArea');
      Toast.expectSuccessToast('Pysäkkialue muokattu');
    }

    function inputBasicDetails(inputs: ExpectedBasicDetails) {
      const { edit } = StopAreaDetailsPage.details;

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
      StopAreaDetailsPage.details.getEditButton().click();
      inputBasicDetails(newBasicDetails);
      StopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();

      // Should have saved the changes and be back at view mode with new details
      assertBasicDetails(newBasicDetails);

      // And the basic details should still match newBasicDetails
      assertBasicDetails(newBasicDetails);
    });

    it('should set observation date after edit', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003, '2025-01-01');

      assertBasicDetails(testAreaExpectedBasicDetails);

      // Edit basic details
      StopAreaDetailsPage.details.getEditButton().click();
      setValidity(DateTime.fromISO('2030-01-01'), null);
      StopAreaDetailsPage.details.edit.getSaveButton().click();
      waitForSaveToBeFinished();

      // Check that the observation date has been set
      StopAreaDetailsPage.observationDateControl
        .getObservationDateInput()
        .should('have.value', '2030-01-01');

      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-');
    });

    it('should allow moving member stop to the stop area', () => {
      StopAreaDetailsPage.memberStops.getAddStopButton().click();
      StopAreaDetailsPage.memberStops.modal.modal().shouldBeVisible();
      SelectStopDropdown.dropdownButton().click();
      SelectStopDropdown.getInput().click();
      SelectStopDropdown.getInput().clearAndType('E2E003');
      SelectStopDropdown.common.getMemberOptions().should('have.length', 1);
      SelectStopDropdown.common
        .getMemberOptions()
        .eq(0)
        .should('contain.text', 'E2E003')
        .click();

      StopAreaDetailsPage.memberStops.modal
        .getTransferDateInput()
        .shouldBeVisible();
      StopAreaDetailsPage.memberStops.modal.setTransferDate(
        DateTime.now().toISODate() ?? '',
      );
      StopAreaDetailsPage.memberStops.modal.getStopVersionsButton().click();

      StopAreaDetailsPage.memberStops.modal
        .getStopVersionsList()
        .shouldBeVisible();

      StopAreaDetailsPage.memberStops.modal.saveButton().click();

      // All stops should be present in the end
      StopAreaDetailsPage.memberStops.getStopRow('E2E001').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E009').shouldBeVisible();
    });

    it('should not find member stop to move to the stop area if it already is in the stop area', () => {
      StopAreaDetailsPage.memberStops.getAddStopButton().click();
      StopAreaDetailsPage.memberStops.modal.modal().shouldBeVisible();
      SelectStopDropdown.dropdownButton().click();
      SelectStopDropdown.getInput().click();
      SelectStopDropdown.getInput().clearAndType('E2E001');
      SelectStopDropdown.common.getMemberOptions().should('have.length', 0);
      StopAreaDetailsPage.memberStops.modal.saveButton().should('be.disabled');
    });

    it('should change name in all stop pages when editing stop area name', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);

      StopAreaDetailsPage.details.getEditButton().click();
      StopAreaDetailsPage.details.edit.getName().clearAndType('uusinimi');
      StopAreaDetailsPage.details.edit.getSaveButton().click();

      StopDetailsPage.visit('E2E001');
      StopDetailsPage.page().shouldBeVisible();
      BasicDetailsViewCard.getAreaName().shouldHaveText('uusinimi');

      StopDetailsPage.visit('E2E009');
      StopDetailsPage.page().shouldBeVisible();
      BasicDetailsViewCard.getAreaName().should('contain.text', 'uusinimi');
    });

    it('should handle deletion', () => {
      // Do not allow deletion when there are stops
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getDeleteButton().click();
      DialogWithButtons.getTextContent().contains(
        'Pysäkkialueeseen liittyy vielä pysäkkejä, eikä sitä voi siksi poistaa. Poista ensin alueeseen liittyvät pysäkit kokonaan tai siirrä ne johonkin toiseen pysäkkialueeseen.',
      );

      // Allow deletion when there are no stops
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2ENQ);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getDeleteButton().click();

      ConfirmationDialog.getConfirmButton().click();
      cy.url().should('include', '/stop-registry');
    });

    it('should show no stops text on stop area without stops', () => {
      // Check that the text is shown on the stop area without stops
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2ENQ);

      StopAreaDetailsPage.details
        .getNoStopsText()
        .shouldHaveText('Ei pysäkkejä.');
    });

    it('should show error when name exceeds 21 characters', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0003);
      StopAreaDetailsPage.details.getEditButton().click();
      const longName = 'A'.repeat(22);

      // Finnish name
      StopAreaDetailsPage.details.edit.getName().clearAndType(longName);
      cy.contains('Nimessä on yli 21 merkkiä.').should('be.visible');
      StopAreaDetailsPage.details.edit.getSaveButton().should('be.disabled');
      // Set a valid name to proceed to testing other name fields
      StopAreaDetailsPage.details.edit.getName().clearAndType('Annankatu 15');

      // Swedish name
      StopAreaDetailsPage.details.edit.getNameSwe().clearAndType(longName);
      cy.contains('Nimessä on yli 21 merkkiä.').should('be.visible');
      StopAreaDetailsPage.details.edit.getSaveButton().should('be.disabled');
      StopAreaDetailsPage.details.edit
        .getNameSwe()
        .clearAndType('Annankatu 15');

      // English name
      AlternativeNamesEdit.getNameEng().clearAndType(longName);
      cy.contains('Nimessä on yli 21 merkkiä.').should('be.visible');
      StopAreaDetailsPage.details.edit.getSaveButton().should('be.disabled');

      AlternativeNamesEdit.getNameEng().clearAndType('Annankatu 15');
      StopAreaDetailsPage.details.edit.getSaveButton().should('be.enabled');
    });
  });

  describe('Copying', () => {
    function waitForCopyToBeFinished() {
      expectGraphQLCallToSucceed('@gqlUpsertStopArea');
      expectGraphQLCallToSucceed('@gqlEditMultipleStopPoints');
      expectGraphQLCallToSucceed('@gqlUpsertStopArea');
      expectGraphQLCallToSucceed('@gqlInsertMultipleStopPoints');
      Toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      expectGraphQLCallToSucceed('@gqlgetStopPlaceDetails');
    }

    function waitForCopyWithNoStopsToBeFinished() {
      expectGraphQLCallToSucceed('@gqlUpsertStopArea');
      Toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      expectGraphQLCallToSucceed('@gqlgetStopPlaceDetails');
    }

    it('should copy and cut current version from end', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form, confirmationModal } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2030-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2052-01-01');
      form.getSubmitButton().click();

      confirmationModal.modal().shouldBeVisible();
      confirmationModal
        .getCurrentVersion()
        .shouldHaveText('1.1.2000 - 1.1.2052');
      confirmationModal.getNewVersion().shouldHaveText('1.1.2030 - 1.1.2052');
      confirmationModal.getCutDate().should('contain.text', '31.12.2029');
      confirmationModal.buttons.getConfirmButton().click();

      waitForCopyToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-1.1.2052');

      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '1.1.2030-1.1.2052',
        );
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '1.1.2030-1.1.2052',
        );
      });

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004, '2025-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-31.12.2029');
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });
    });

    it('should copy and cut current version from end as indefinite', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form, confirmationModal } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2030-01-01');
      form.validity.setAsIndefinite(true);
      form.getSubmitButton().click();

      confirmationModal.modal().shouldBeVisible();
      confirmationModal
        .getCurrentVersion()
        .shouldHaveText('1.1.2000 - 1.1.2052');
      confirmationModal.getNewVersion().shouldHaveText('1.1.2030 -');
      confirmationModal.getCutDate().should('contain.text', '31.12.2029');
      confirmationModal.buttons.getConfirmButton().click();

      waitForCopyToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-');

      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should('have.text', '1.1.2030-');
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should('have.text', '1.1.2030-');
      });

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004, '2025-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-31.12.2029');
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });
    });

    it('should copy and cut current version from start', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2E011);
      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form, confirmationModal } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2000-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2029-12-31');
      form.getSubmitButton().click();

      confirmationModal.modal().shouldBeVisible();
      confirmationModal
        .getCurrentVersion()
        .shouldHaveText('1.1.2000 - 1.1.2052');
      confirmationModal.getNewVersion().shouldHaveText('1.1.2000 - 31.12.2029');
      confirmationModal.getCutDate().should('contain.text', '1.1.2030');
      confirmationModal.buttons.getConfirmButton().click();

      waitForCopyToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-31.12.2029');

      StopAreaDetailsPage.memberStops.getStopRow('E2E011').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E011').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2E011, '2030-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-1.1.2052');
      StopAreaDetailsPage.memberStops.getStopRow('E2E011').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E011').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '1.1.2030-1.1.2052',
        );
      });
    });

    it('should copy and cut current indefinite version from start', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);
      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form, confirmationModal } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2000-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2029-12-31');
      form.getSubmitButton().click();

      confirmationModal.modal().shouldBeVisible();
      confirmationModal
        .getCurrentVersion()
        .shouldHaveText('1.1.2000 - 1.1.2052');
      confirmationModal.getNewVersion().shouldHaveText('1.1.2000 - 31.12.2029');
      confirmationModal.getCutDate().should('contain.text', '1.1.2030');
      confirmationModal.buttons.getConfirmButton().click();

      waitForCopyToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-31.12.2029');

      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-31.12.2029',
        );
      });

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004, '2030-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-1.1.2052');
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should('have.text', '1.1.2030-');
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should('have.text', '1.1.2030-');
      });
    });

    it('should show error when copying version over current version', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();
      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #2');
      form.validity.setStartDate('2000-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2059-12-31');
      form.getSubmitButton().click();

      Toast.expectDangerToast(
        'Pysäkkialueen kopiointi epäonnistui:\nUudelle versiolle annettu päivämääräväli on virheellinen.',
      );
    });

    it('should show error when copying version over period with multiple versions', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form, confirmationModal } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2030-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2052-01-01');
      form.getSubmitButton().click();

      confirmationModal.modal().shouldBeVisible();
      confirmationModal
        .getCurrentVersion()
        .shouldHaveText('1.1.2000 - 1.1.2052');
      confirmationModal.getNewVersion().shouldHaveText('1.1.2030 - 1.1.2052');
      confirmationModal.getCutDate().should('contain.text', '31.12.2029');
      confirmationModal.buttons.getConfirmButton().click();

      waitForCopyToBeFinished();

      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-1.1.2052');

      // Try to create a copy over the original version
      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #2');
      form.validity.setStartDate('2025-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2040-01-01');
      form.getSubmitButton().click();

      Toast.expectDangerToast(
        'Pysäkkialueen kopiointi epäonnistui:\nValituille päivämäärille on olemassa muita pysäkkialueen versioita mikä estää kopioinnin.\nMuokkaa päällekkäisiä versioita ennen jatkamista.',
      );
    });

    it('should include stops with validity after stop area when copying version', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-1.1.2052');

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2052-01-02');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2060-01-01');
      form.getSubmitButton().click();

      waitForCopyToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('2.1.2052-1.1.2060');

      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '2.1.2052-1.1.2060',
        );
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '2.1.2052-1.1.2060',
        );
      });

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004, '2025-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-1.1.2052');
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E003').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-1.1.2052',
        );
      });
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').shouldBeVisible();
      StopAreaDetailsPage.memberStops.getStopRow('E2E006').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-1.1.2052',
        );
      });
    });

    it('should not include stops after their validity has ended when copying version', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2E011);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2052-01-02');
      form.validity.setAsIndefinite(true);
      form.getSubmitButton().click();

      waitForCopyWithNoStopsToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('2.1.2052-');
      StopAreaDetailsPage.details.getNoStopsText().shouldBeVisible();

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2E011, '2025-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-1.1.2052');

      StopAreaDetailsPage.memberStops.getStopRow('E2E011').shouldBeVisible();

      StopAreaDetailsPage.memberStops.getStopRow('E2E011').within(() => {
        cy.get('[title="Voimassaolo"]').should(
          'have.text',
          '20.3.2020-1.1.2052',
        );
      });
    });

    it('should be able to copy stop area without stops', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2ENQ);
      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form, confirmationModal } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2030-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2060-01-01');
      form.getSubmitButton().click();

      confirmationModal.modal().shouldBeVisible();
      confirmationModal
        .getCurrentVersion()
        .shouldHaveText('1.1.2000 - 1.1.2052');
      confirmationModal.getNewVersion().shouldHaveText('1.1.2030 - 1.1.2060');
      confirmationModal.getCutDate().should('contain.text', '31.12.2029');
      confirmationModal.buttons.getConfirmButton().click();

      waitForCopyWithNoStopsToBeFinished();

      // Confirm that the dates of the new version are correct
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2030-1.1.2060');
      StopAreaDetailsPage.details.getNoStopsText().shouldBeVisible();

      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.E2ENQ, '2025-01-01');

      // Confirm that the old version was cut correctly
      StopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2000-31.12.2029');
      StopAreaDetailsPage.details.getNoStopsText().shouldBeVisible();
    });

    it('should not allow copying of stop area if it makes a route validity shorter', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);
      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2026-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2030-01-01');
      form.getSubmitButton().click();

      Toast.expectDangerToast(
        'Pysäkkialueen kopiointi tekisi ainakin yhden pysäkkialueen pysäkin kautta kulkevan reitin voimassaolon virheelliseksi.\nEnnen jatkamista muokkaa reittejä, joihin tämän pysäkkialueen pysäkit kuuluvat.',
      );

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #2');
      form.validity.setStartDate('2020-01-01');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2022-01-01');
      form.getSubmitButton().click();

      Toast.expectDangerToast(
        'Pysäkkialueen kopiointi tekisi ainakin yhden pysäkkialueen pysäkin kautta kulkevan reitin voimassaolon virheelliseksi.\nEnnen jatkamista muokkaa reittejä, joihin tämän pysäkkialueen pysäkit kuuluvat.',
      );
    });

    it('should not allow copy if the end date is before the start date', () => {
      StopAreaDetailsPage.visit(dbIds.stopPlaceIdsByName.X0004);

      StopAreaDetailsPage.titleRow.getActionMenu().click();
      StopAreaDetailsPage.titleRow.getCopyButton().click();

      StopAreaDetailsPage.copyModal.modal().shouldBeVisible();
      const { form } = StopAreaDetailsPage.copyModal;

      form.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E test copy #1');
      form.validity.setStartDate('2030-01-02');
      form.validity.setAsIndefinite(false);
      form.validity.setEndDate('2030-01-01');
      form.getSubmitButton().click();

      form.validity
        .getEndDateValidityError()
        .shouldBeVisible()
        .should(
          'have.text',
          'Päättymispäivämäärä ei voi olla ennen alkamispäivämäärää',
        );
    });
  });
});
