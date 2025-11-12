import { DateTime } from 'luxon';
import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { useUrlQuery } from '../../../hooks';
import { Priority } from '../../../types/enums';
import {
  AllOptionEnum,
  DisplayedSearchResultType,
  SearchConditions,
} from '../../../utils';

export type FilterConditions = {
  displayedType: DisplayedSearchResultType;
};

/**
 * Search parameter object with search conditions and filter
 * conditions separately
 */
export type SearchParameters = {
  search: SearchConditions;
  filter: FilterConditions;
};

/**
 * Query string object where parameters are in string format
 */
export type QueryStringParameters = {
  priorities: string;
  label: string;
  primaryVehicleMode?: string;
  typeOfLine?: string;
  displayedType: string;
};

/**
 * Query string object where parameters are deserialized and validated
 * in their correct format
 */
export type DeserializedQueryStringParameters = {
  priorities: ReadonlyArray<Priority>;
  label: string;
  primaryVehicleMode?: ReusableComponentsVehicleModeEnum | AllOptionEnum;
  typeOfLine?: RouteTypeOfLineEnum | AllOptionEnum;
  displayedType: DisplayedSearchResultType;
};

export enum SearchQueryParameterNames {
  Label = 'label',
  Priorities = 'priorities',
  TransportMode = 'transportMode',
  DisplayedType = 'displayedType',
  TypeOfLine = 'typeOfLine',
  ObservationDate = 'observationDate',
}

const DEFAULT_PRIORITIES = [Priority.Standard];
const DEFAULT_TRANSPORT_MODE = AllOptionEnum.All;
const DEFAULT_TYPE_OF_LINE = AllOptionEnum.All;
const DEFAULT_DISPLAYED_DATA = DisplayedSearchResultType.Lines;
const DEFAULT_LABEL = '';
const DEFAULT_OBSERVATION_DATE = DateTime.now().startOf('day');

export const useSearchQueryParser = () => {
  const {
    getStringParamFromUrlQuery,
    getPriorityArrayFromUrlQuery,
    getTransportModeArrayFromUrlQuery,
    getEnumFromUrlQuery,
    getDateTimeFromUrlQuery,
  } = useUrlQuery();
  const label =
    getStringParamFromUrlQuery(SearchQueryParameterNames.Label) ??
    DEFAULT_LABEL;

  const priorities =
    getPriorityArrayFromUrlQuery(SearchQueryParameterNames.Priorities) ??
    DEFAULT_PRIORITIES;

  const transportMode =
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
      label,
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
