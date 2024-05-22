import { useUrlQuery } from '../../urlQuery';

export type StopSearchConditions = {
  label: string;
  elyNumber: string;
  address: string;
};

export enum StopSearchQueryParameterNames {
  Label = 'label',
  ELYNumber = 'elyNumber',
  Address = 'address',
}

const DEFAULT_LABEL = '';
const DEFAULT_ELY_NUMBER = '';
const DEFAULT_ADDRESS = '';

export const useStopSearchQueryParser = () => {
  const { getStringParamFromUrlQuery } = useUrlQuery();
  const label =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.Label) ??
    DEFAULT_LABEL;
  const elyNumber =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.ELYNumber) ??
    DEFAULT_ELY_NUMBER;
  const address =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.Address) ??
    DEFAULT_ADDRESS;

  return {
    search: {
      label,
      address,
      elyNumber,
    },
    filter: {
      // TODO
    },
  };
};
