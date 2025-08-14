import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { StopRegistryParentStopPlaceInput } from '../../../../generated/graphql';
import { useUpdateTerminal } from '../../../../hooks/stop-registry/terminals';
import { EnrichedParentStopPlace } from '../../../../types';
import { patchKeyValues } from '../../../../utils';
import { TerminalValidityFormState } from '../components/terminal-versions/TerminalValidityFormState';
import { EditTerminalValidityResult } from '../types';

type EditTerminalValidityInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalValidityFormState;
};

const mapFormStateToInput = ({
  terminal,
  state,
}: EditTerminalValidityInputs): StopRegistryParentStopPlaceInput => {
  const { id } = terminal;

  const keyValues = patchKeyValues(
    terminal,
    compact([
      state.validityStart
        ? {
            key: 'validityStart',
            values: [state.validityStart],
          }
        : undefined,
      state.validityEnd
        ? {
            key: 'validityEnd',
            values: [state.validityEnd],
          }
        : undefined,
    ]),
  ).filter((kv) => (kv?.key !== 'validityEnd' ? true : !state.indefinite));

  return {
    id,
    keyValues,
  };
};

export const useEditTerminalValidity = () => {
  const { updateTerminal, defaultErrorHandler } = useUpdateTerminal();

  const editTerminalValidity = useCallback(
    async ({
      terminal,
      state,
    }: EditTerminalValidityInputs): Promise<EditTerminalValidityResult | null> => {
      if (!terminal.id || !terminal.geometry) {
        return null;
      }

      const input = mapFormStateToInput({ terminal, state });
      const updatedTerminal = await updateTerminal(input);

      return {
        privateCode: updatedTerminal?.privateCode?.value ?? '',
        validityStart: DateTime.fromISO(state.validityStart),
        validityEnd: state.validityEnd
          ? DateTime.fromISO(state.validityEnd)
          : undefined,
        indefinite: state.indefinite,
      };
    },
    [updateTerminal],
  );

  return {
    editTerminalValidity,
    defaultErrorHandler,
  };
};
