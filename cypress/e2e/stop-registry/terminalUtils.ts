import {
  AlternativeNamesEdit,
  TerminalDetailsPage,
  Toast,
} from '../../pageObjects';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';

export type EditableBasicDetails = {
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

export type EditableLocationDetails = {
  readonly streetAddress: string;
  readonly postalCode: string;
};

export function inputBasicDetails(inputs: EditableBasicDetails) {
  const { edit } = TerminalDetailsPage.terminalDetails;

  edit.getDescription().clearAndType(inputs.description);
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
  edit.selectTerminalType(inputs.terminalType);
  edit.getDeparturePlatforms().clearAndType(inputs.departurePlatforms);
  edit.getArrivalPlatforms().clearAndType(inputs.arrivalPlatforms);
  edit.getLoadingPlatforms().clearAndType(inputs.loadingPlatforms);
  edit.getElectricCharging().clearAndType(inputs.electricCharging);
}

export function inputLocationDetails(inputs: EditableLocationDetails) {
  const { edit } = TerminalDetailsPage.locationDetails;

  edit.getStreetAddress().clearAndType(inputs.streetAddress);
  edit.getPostalCode().clearAndType(inputs.postalCode);
}

export function waitForSaveToBeFinished() {
  expectGraphQLCallToSucceed('@gqlUpdateTerminal');
  Toast.expectSuccessToast('Terminaali muokattu');
}

export function waitForValidityEditToBeFinished() {
  expectGraphQLCallToSucceed('@gqlUpdateTerminal');
  Toast.expectSuccessToast('Voimassaoloaika muokattu');
}

export const changedBasicDetails: EditableBasicDetails = {
  description: 'Changed description',
  name: 'Changed name',
  nameSwe: 'Changed name swe',
  nameEng: 'Changed name eng',
  nameLongFin: 'Changed name long fin',
  nameLongSwe: 'Changed name long swe',
  nameLongEng: 'Changed name long eng',
  abbreviationFin: 'Changed abbr fin',
  abbreviationSwe: 'Changed abbr swe',
  abbreviationEng: 'Changed abbr eng',
  terminalType: 'TramTerminal',
  departurePlatforms: '5',
  arrivalPlatforms: '5',
  loadingPlatforms: '2',
  electricCharging: '3',
};

export const changedLocationDetails: EditableLocationDetails = {
  streetAddress: 'Changed street address',
  postalCode: 'Changed postal code',
};
