import { ResultSelection } from './ResultSelection';
import { SortStopsBy } from './SortStopsBy';

export type CountAndSortingRowProps = {
  readonly allSelected: boolean;
  readonly className?: string;
  readonly groupingField: SortStopsBy;
  readonly onToggleSelectAll: () => void;
  readonly hasResults: boolean;
  readonly resultCount: number;
  readonly resultSelection: ResultSelection;
};

export const commonSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
];
