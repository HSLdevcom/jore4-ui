import { useUrlQuery } from '../../urlQuery';

export type StopSearchConditions = {
  label: string;
  elyNumber: string;
};

export enum StopSearchQueryParameterNames {
  Label = 'label',
  ELYNumber = 'elyNumber',
}

const DEFAULT_LABEL = '';
const DEFAULT_ELY_NUMBER = '';

export const useStopSearchQueryParser = () => {
  const { getStringParamFromUrlQuery } = useUrlQuery();
  const label =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.Label) ??
    DEFAULT_LABEL;
  const elyNumber =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.ELYNumber) ??
    DEFAULT_ELY_NUMBER;

  return {
    search: {
      label,
      elyNumber,
    },
    filter: {
      // TODO
    },
  };
};
