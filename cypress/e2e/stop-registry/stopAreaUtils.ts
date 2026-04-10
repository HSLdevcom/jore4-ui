import { DateTime } from 'luxon';
import {
  AlternativeNamesEdit,
  StopAreaDetailsPage,
  Toast,
} from '../../pageObjects';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';

export type EditableBasicDetails = {
  readonly name: string;
  readonly nameSwe: string;
  readonly nameEng: string;
  readonly nameLongFin: string;
  readonly nameLongSwe: string;
  readonly nameLongEng: string;
  readonly abbreviationFin: string;
  readonly abbreviationSwe: string;
  readonly abbreviationEng: string;
  readonly validFrom: DateTime;
  readonly validTo: DateTime | null;
};

export type ExpectedBasicDetails = EditableBasicDetails & {
  readonly privateCode: string;
  readonly areaSize: string;
  readonly parentTerminal: string;
  readonly longitude: number;
  readonly latitude: number;
};

export function setValidity(from: DateTime, to: DateTime | null) {
  StopAreaDetailsPage.details.edit.validity.setStartDate(
    from.toISODate() ?? '',
  );
  if (to) {
    StopAreaDetailsPage.details.edit.validity.setAsIndefinite(false);
    StopAreaDetailsPage.details.edit.validity.setEndDate(to.toISODate() ?? '');
  } else {
    StopAreaDetailsPage.details.edit.validity.setAsIndefinite(true);
  }
}

export function inputBasicDetails(inputs: EditableBasicDetails) {
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

export function waitForSaveToBeFinished() {
  expectGraphQLCallToSucceed('@gqlUpsertStopArea');
  Toast.expectSuccessToast('Pysäkkialue muokattu');
}

export const changedBasicDetails: EditableBasicDetails = {
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
