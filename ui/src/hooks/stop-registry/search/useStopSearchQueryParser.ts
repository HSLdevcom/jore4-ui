import { useUrlQuery } from '../../urlQuery';

export type StopSearchConditions = {
  label: string;
};

export enum StopSearchQueryParameterNames {
  Label = 'label',
}

const DEFAULT_LABEL = '';

export const useStopSearchQueryParser = () => {
  const { getStringParamFromUrlQuery } = useUrlQuery();
  const label =
    getStringParamFromUrlQuery(StopSearchQueryParameterNames.Label) ??
    DEFAULT_LABEL;

  return {
    search: {
      label,
    },
    filter: {
      // TODO
    },
  };
};
