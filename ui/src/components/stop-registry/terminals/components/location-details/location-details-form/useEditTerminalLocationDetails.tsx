import compact from 'lodash/compact';
import { useCallback } from 'react';
import { StopRegistryParentStopPlaceInput } from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { patchKeyValues } from '../../../../../../utils';
import { useUpsertTerminal } from '../../../useUpsertTerminal';
import { TerminalLocationDetailsFormState } from './schema';

type UpsertTerminalInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalLocationDetailsFormState;
};

const mapFormStateToInput = ({
  terminal,
  state,
}: UpsertTerminalInputs): StopRegistryParentStopPlaceInput => {
  const { id } = terminal;

  return {
    id,
    keyValues: patchKeyValues(
      terminal,
      compact([
        state.streetAddress
          ? {
              key: 'streetAddress',
              values: [state.streetAddress],
            }
          : undefined,
        state.postalCode
          ? {
              key: 'postalCode',
              values: [state.postalCode],
            }
          : undefined,
        state.municipality
          ? {
              key: 'municipality',
              values: [state.municipality],
            }
          : undefined,
        state.fareZone
          ? {
              key: 'fareZone',
              values: [state.fareZone],
            }
          : undefined,
      ]),
    ),
  };
};

export const useUpsertTerminalLocationDetails = () => {
  const { upsertTerminal, defaultErrorHandler } = useUpsertTerminal();

  const upsertTerminalLocationDetails = useCallback(
    async (inputs: UpsertTerminalInputs) => {
      const input = mapFormStateToInput(inputs);
      return upsertTerminal(input);
    },
    [upsertTerminal],
  );

  return {
    upsertTerminalLocationDetails,
    defaultErrorHandler,
  };
};
