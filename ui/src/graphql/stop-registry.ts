import { StopRegistryValidBetween } from '../generated/graphql';
import { isGqlEntity } from './types';

export const isValidBetween = (
  input: unknown,
): input is Pick<StopRegistryValidBetween, '__typename'> => {
  return (
    // eslint-disable-next-line no-underscore-dangle
    isGqlEntity(input) && input.__typename === 'stop_registry_ValidBetween'
  );
};
