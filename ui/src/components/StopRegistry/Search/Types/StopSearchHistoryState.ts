import { ResultSelectionHistoryState } from '../../../common/Search/ResultSelection';

export type StopSearchHistoryState = ResultSelectionHistoryState & {
  readonly searchIsExpanded: boolean;
};
