import {
  StopAreaFormFieldsFragment,
  StopAreaMemberFieldsFragment,
} from '../generated/graphql';

export type StopAreaByIdResult = Omit<StopAreaFormFieldsFragment, 'members'> & {
  members: Array<StopAreaMemberFieldsFragment> | undefined;
};
