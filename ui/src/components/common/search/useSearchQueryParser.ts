import { DateTime } from 'luxon';
import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { useUrlQuery } from '../../../hooks';
import { Priority } from '../../../types/enums';
import { AllOptionEnum, DisplayedSearchResultType } from '../../../utils';

export type FilterConditions = {
  displayedType: DisplayedSearchResultType;
};

export type SearchConditions = {
  query: string;
  priorities: Array<Priority>;
  transportMode: Array<ReusableComponentsVehicleModeEnum | AllOptionEnum>;
  typeOfLine: RouteTypeOfLineEnum | AllOptionEnum;
  observationDate: DateTime;
};

export type QueryParameters = {
  search: SearchConditions;
  filter: FilterConditions;
};

export enum SearchQueryParameterNames {
  Query = 'query',
  Priorities = 'priorities',
  TransportMode = 'transportMode',
  DisplayedType = 'displayedType',
  TypeOfLine = 'typeOfLine',
  ObservationDate = 'observationDate',
}

const DEFAULT_PRIORITIES = [Priority.Standard];
const DEFAULT_TRANSPORT_MODE = [AllOptionEnum.All];
const DEFAULT_TYPE_OF_LINE = AllOptionEnum.All;
const DEFAULT_DISPLAYED_DATA = DisplayedSearchResultType.Lines;
const DEFAULT_LABEL = '';
const DEFAULT_OBSERVATION_DATE = DateTime.now().startOf('day');

export const useSearchQueryParser = (): QueryParameters => {
  const {
    getStringParamFromUrlQuery,
    getPriorityArrayFromUrlQuery,
    getTransportModeArrayFromUrlQuery,
    getEnumFromUrlQuery,
    getDateTimeFromUrlQuery,
  } = useUrlQuery();
  const query =
    getStringParamFromUrlQuery(SearchQueryParameterNames.Query) ??
    DEFAULT_LABEL;

  const priorities =
    getPriorityArrayFromUrlQuery(SearchQueryParameterNames.Priorities) ??
    DEFAULT_PRIORITIES;

  const transportMode: Array<
    ReusableComponentsVehicleModeEnum | AllOptionEnum
  > =
    getTransportModeArrayFromUrlQuery(
      SearchQueryParameterNames.TransportMode,
    ) ?? DEFAULT_TRANSPORT_MODE;

  const typeOfLine =
    getEnumFromUrlQuery(
      SearchQueryParameterNames.TypeOfLine,
      RouteTypeOfLineEnum,
    ) ?? DEFAULT_TYPE_OF_LINE;

  const displayedType =
    getEnumFromUrlQuery(
      SearchQueryParameterNames.DisplayedType,
      DisplayedSearchResultType,
    ) ?? DEFAULT_DISPLAYED_DATA;
  const observationDate =
    getDateTimeFromUrlQuery(SearchQueryParameterNames.ObservationDate) ??
    DEFAULT_OBSERVATION_DATE;

  return {
    search: {
      query,
      priorities,
      transportMode,
      typeOfLine,
      observationDate,
    },
    filter: {
      displayedType,
    },
  };
};
