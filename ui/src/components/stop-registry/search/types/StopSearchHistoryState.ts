import { ResultSelection } from './ResultSelection';

export type StopSearchHistoryState = {
  readonly searchIsExpanded: boolean;
  readonly resultSelection: ResultSelection;
  readonly knownStopIds: ReadonlyArray<string>;
};
