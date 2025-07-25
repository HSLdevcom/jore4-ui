import compact from 'lodash/compact';
import { useCallback } from 'react';
import { StopRegistryParentStopPlaceInput } from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { patchKeyValues } from '../../../../../../utils';
import { SelectedStop } from '../../../../components/SelectMemberStops/schema';
import { useUpdateTerminal } from '../../../useUpdateTerminal';
import { TerminalLocationDetailsFormState } from './schema';
import { useEditMembersOfTerminal } from './useEditMembersOfTerminal';

type UpsertTerminalInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalLocationDetailsFormState;
  readonly selectedStops?: SelectedStop[];
};

const mapFormStateToInput = ({
  terminal,
  state,
}: Omit<
  UpsertTerminalInputs,
  'selectedStops'
>): StopRegistryParentStopPlaceInput => {
  return {
    id: terminal.id,
    keyValues: patchKeyValues(
      terminal,
      compact([
        state.streetAddress
          ? { key: 'streetAddress', values: [state.streetAddress] }
          : undefined,
        state.postalCode
          ? { key: 'postalCode', values: [state.postalCode] }
          : undefined,
        state.municipality
          ? { key: 'municipality', values: [state.municipality] }
          : undefined,
        state.fareZone
          ? { key: 'fareZone', values: [state.fareZone] }
          : undefined,
      ]),
    ),
  };
};

export const useUpsertTerminalLocationDetails = () => {
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
};
