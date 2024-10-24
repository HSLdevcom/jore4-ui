import identity from 'lodash/identity';
import { DateTime } from 'luxon';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  serializeState,
  toEnum,
  useTypedUrlState,
} from '../../../../hooks';
import { StopRegistryMunicipality } from '../../../../types/enums';
import { AllOptionEnum, numberEnumEntries } from '../../../../utils';
import {
  SearchBy,
  SearchFor,
  StopSearchFilters,
  defaultFilters,
} from '../types';
import {
  handleAllMunicipalities,
  knownMunicipalities,
} from './handleAllMunicipalities';

type StopSearchUrlState = StopSearchFilters;

const SEPRATOR = ',';

const serializers: UrlStateSerializers<StopSearchUrlState> = {
  query: identity,
  elyNumber: identity,
  searchBy: identity,
  searchFor: identity,
  observationDate: (it) => it.toISODate(),
  municipalities: (them) =>
    them
      .map((it) =>
        it === AllOptionEnum.All ? it : StopRegistryMunicipality[it],
      )
      .join(SEPRATOR),
};

const lowerCaseMunicipalities: ReadonlyArray<
  [string, StopRegistryMunicipality]
> = numberEnumEntries(StopRegistryMunicipality).map(([key, value]) => [
  key.toLowerCase(),
  value,
]);

function parseMunicipalities(
  value: string,
): Array<StopRegistryMunicipality | AllOptionEnum> {
  const parsed = value.split(SEPRATOR).map((it) => {
    if (it === AllOptionEnum.All) {
      return AllOptionEnum.All;
    }

    const asNumber = Number(it);
    if (knownMunicipalities.includes(asNumber)) {
      return asNumber as StopRegistryMunicipality;
    }

    const lowercased = it.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, byName] =
      lowerCaseMunicipalities.find(([key]) => key === lowercased) ?? [];
    if (byName) {
      return byName;
    }

    throw new TypeError(`Value (${value}) is not a valid municipality!`);
  });

  return handleAllMunicipalities(parsed);
}

const deserializers: UrlStateDeserializers<StopSearchUrlState> = {
  query: identity,
  elyNumber: identity,
  searchBy: toEnum(Object.values(SearchBy)),
  searchFor: toEnum(Object.values(SearchFor)),
  observationDate: (value) => DateTime.fromISO(value),
  municipalities: parseMunicipalities,
};

const defaultValues: StopSearchUrlState = defaultFilters;

export function useStopSearchUrlState() {
  return useTypedUrlState<StopSearchUrlState>(
    serializers,
    deserializers,
    defaultValues,
  );
}

export function stopSearchUrlStateToSearch(state: StopSearchUrlState): string {
  return serializeState(serializers, defaultValues, state).toString();
}
