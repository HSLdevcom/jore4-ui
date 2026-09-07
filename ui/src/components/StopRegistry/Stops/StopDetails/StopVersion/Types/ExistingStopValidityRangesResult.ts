import { ResolveExistingStopValidityRangesQuery } from '../../../../../../generated/graphql';

export type ExistingStopValidityRange = Readonly<
  ResolveExistingStopValidityRangesQuery['stopPoints'][number]
>;
