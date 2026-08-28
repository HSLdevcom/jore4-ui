import { StopFormStopAreaInfoFragment } from '../../../../generated/graphql';
import { RawAlternativeName, findRawAlternativeName } from '../../../../utils';
import { StopModalStopAreaFormSchema } from '../types';

export function parseStopFormStopAreaInfo(
  rawArea: StopFormStopAreaInfoFragment | null | undefined,
): StopModalStopAreaFormSchema | null {
  if (
    !rawArea ||
    !rawArea.netexId ||
    !rawArea.privateCode ||
    !rawArea.validityStart
  ) {
    return null;
  }

  const names: ReadonlyArray<RawAlternativeName> = rawArea.alternativeNames
    .map((it) => it.name)
    .concat({
      type: 'TRANSLATION',
      value: rawArea.nameValue,
      lang: rawArea.nameLang,
    });

  return {
    netexId: rawArea.netexId,
    privateCode: rawArea.privateCode,

    validityStart: rawArea.validityStart,
    validityEnd: rawArea.validityEnd ?? null,

    nameFin: findRawAlternativeName(names, 'TRANSLATION', 'fin'),
    nameSwe: findRawAlternativeName(names, 'TRANSLATION', 'swe'),
    nameEng: findRawAlternativeName(names, 'TRANSLATION', 'eng'),

    longNameFin: findRawAlternativeName(names, 'ALIAS', 'fin'),
    longNameSwe: findRawAlternativeName(names, 'ALIAS', 'swe'),
    longNameEng: findRawAlternativeName(names, 'ALIAS', 'eng'),

    abbreviationFin: findRawAlternativeName(names, 'OTHER', 'fin'),
    abbreviationSwe: findRawAlternativeName(names, 'OTHER', 'swe'),
    abbreviationEng: findRawAlternativeName(names, 'OTHER', 'eng'),
  };
}
