import compact from 'lodash/compact';
import { useCallback } from 'react';
import { StopRegistryParentStopPlaceInput } from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { KnownValueKey, patchKeyValues } from '../../../../../../utils';
import { SelectedStop } from '../../../../components/SelectMemberStops/common/schema';
import { useEditMembersOfTerminal, useUpdateTerminal } from '../../../Common';
import { TerminalLocationDetailsFormState } from './schema';

type UpsertTerminalInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalLocationDetailsFormState;
  readonly selectedStops?: ReadonlyArray<SelectedStop>;
};

function mapFormStateToInput({
  terminal,
  state,
}: Omit<
  UpsertTerminalInputs,
  'selectedStops'
>): StopRegistryParentStopPlaceInput {
  return {
    id: terminal.id,
    keyValues: patchKeyValues(
      terminal,
      compact([
        state.streetAddress
          ? {
              key: KnownValueKey.StreetAddress,
              values: [state.streetAddress],
            }
          : undefined,
        state.postalCode
          ? { key: KnownValueKey.PostalCode, values: [state.postalCode] }
          : undefined,
      ]),
    ),
  };
}

export function useUpsertTerminalLocationDetails() {
  const { updateTerminal, defaultErrorHandler } = useUpdateTerminal();
  const { editMembersOfTerminal } = useEditMembersOfTerminal();

  const upsertTerminalLocationDetails = useCallback(
    async (inputs: UpsertTerminalInputs) => {
      const { terminal, state, selectedStops = [] } = inputs;

      const terminalInput = mapFormStateToInput({ terminal, state });
      await updateTerminal(terminalInput);

      if (!terminal.id) {
        return;
      }

      await editMembersOfTerminal({
        terminal,
        selectedStops,
      });
    },
    [updateTerminal, editMembersOfTerminal],
  );

  return {
    upsertTerminalLocationDetails,
    defaultErrorHandler,
  };
}
