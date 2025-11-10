import { StopFormStopAreaInfoFragment } from '../../../../generated/graphql';
import { StopModalStopAreaFormSchema } from '../types';

export type RawName = {
  readonly type?: string | null;
  readonly value?: string | null;
  readonly lang?: string | null;
};

export function findName(
  names: ReadonlyArray<RawName>,
  type: string,
  lang: string,
): string | null {
  return (
    names.find((name) => name.type === type && name.lang === lang)?.value ??
    null
  );
}

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

  const names: ReadonlyArray<RawName> = rawArea.alternativeNames
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

    nameFin: findName(names, 'TRANSLATION', 'fin'),
    nameSwe: findName(names, 'TRANSLATION', 'swe'),
    nameEng: findName(names, 'TRANSLATION', 'eng'),

    longNameFin: findName(names, 'ALIAS', 'fin'),
    longNameSwe: findName(names, 'ALIAS', 'swe'),
    longNameEng: findName(names, 'ALIAS', 'eng'),

    abbreviationFin: findName(names, 'OTHER', 'fin'),
    abbreviationSwe: findName(names, 'OTHER', 'swe'),
    abbreviationEng: findName(names, 'OTHER', 'eng'),
  };
}
