import { StopRegistryNameType } from '../../generated/graphql';

type AlternativeNames = {
  nameFinLong?: string;
  nameSweLong?: string;
  nameEngLong?: string;
  abbreviationFin?: string;
  abbreviationSwe?: string;
  abbreviationEng?: string;
  nameEng?: string;
  nameSwe?: string;
};

export const mapToAlternativeNames = (data: AlternativeNames) => {
  return [
    data.nameFinLong
      ? {
          name: { lang: 'fin', value: data.nameFinLong },
          nameType: StopRegistryNameType.Alias,
        }
      : null,
    data.nameSweLong
      ? {
          name: { lang: 'swe', value: data.nameSweLong },
          nameType: StopRegistryNameType.Alias,
        }
      : null,
    data.nameEngLong
      ? {
          name: { lang: 'eng', value: data.nameEngLong },
          nameType: StopRegistryNameType.Alias,
        }
      : null,
    data.abbreviationFin
      ? {
          name: { lang: 'fin', value: data.abbreviationFin },
          nameType: StopRegistryNameType.Other,
        }
      : null,
    data.abbreviationSwe
      ? {
          name: { lang: 'swe', value: data.abbreviationSwe },
          nameType: StopRegistryNameType.Other,
        }
      : null,
    data.abbreviationEng
      ? {
          name: { lang: 'eng', value: data.abbreviationEng },
          nameType: StopRegistryNameType.Other,
        }
      : null,
    data.nameEng
      ? {
          name: { lang: 'eng', value: data.nameEng },
          nameType: StopRegistryNameType.Translation,
        }
      : null,
    {
      name: { lang: 'swe', value: data.nameSwe },
      nameType: StopRegistryNameType.Translation,
    },
  ].filter(Boolean);
};
