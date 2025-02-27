import { StopSearchRow } from '../../../search';

export type StopAreaMemberRow = {
  readonly quay: StopSearchRow;
  readonly selected: boolean;
  readonly added: boolean;
};
