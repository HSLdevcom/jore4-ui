import { StopAreaDetailsFragment } from '../../../../../generated/graphql';

export type StopAreaComponentProps = {
  readonly area: StopAreaDetailsFragment;
  readonly className?: string;
};

export type EditableStopAreaComponentProps = {
  readonly area: StopAreaDetailsFragment;
  readonly className?: string;
  readonly refetch: () => Promise<unknown>;
};
