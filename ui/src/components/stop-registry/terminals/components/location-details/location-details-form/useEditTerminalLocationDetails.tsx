import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  StopRegistryParentStopPlaceInput,
  useAddToMultiModalStopPlaceMutation,
  useRemoveFromMultiModalStopPlaceMutation,
} from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { patchKeyValues } from '../../../../../../utils';
import { useUpsertTerminal } from '../../../useUpsertTerminal';
import { SelectedStop, TerminalLocationDetailsFormState } from './schema';

const GQL_REMOVE_FROM_MULTIMODAL_STOP_PLACE = gql`
  mutation removeFromMultiModalStopPlace(
    $parentSiteRef: String!
    $stopPlaceId: [String]
  ) {
    stop_registry {
      removeFromMultiModalStopPlace(
        parentSiteRef: $parentSiteRef
        stopPlaceId: $stopPlaceId
      ) {
        id
      }
    }
  }
`;

const GQL_ADD_TO_MULTIMODAL_STOP_PLACE = gql`
  mutation addToMultiModalStopPlace(
    $input: stop_registry_addToMultiModalStopPlaceInput!
  ) {
    stop_registry {
      addToMultiModalStopPlace(input: $input) {
        id
      }
    }
  }
`;

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
  const { upsertTerminal, defaultErrorHandler } = useUpsertTerminal();
  const [addToMultiModalStopPlace] = useAddToMultiModalStopPlaceMutation();
  const [removeFromMultiModalStopPlace] =
    useRemoveFromMultiModalStopPlaceMutation();

  const upsertTerminalLocationDetails = useCallback(
    async (inputs: UpsertTerminalInputs) => {
      const { terminal, state, selectedStops = [] } = inputs;

      const terminalInput = mapFormStateToInput({ terminal, state });
      await upsertTerminal(terminalInput);

      if (!terminal.id) {
        return;
      }

      const existingChildrenIds = compact(
        terminal.children?.map((child) => child?.id) ?? [],
      );
      const selectedStopIds = selectedStops.map((stop) => stop.id);

      const stopPlacesToAdd = selectedStopIds.filter(
        (id) => !existingChildrenIds.includes(id),
      );

      const stopPlacesToRemove = existingChildrenIds.filter(
        (id) => !selectedStopIds.includes(id),
      );

      if (selectedStopIds.length === 0) {
        throw new Error('Terminal must have at least one member stop');
      }

      if (stopPlacesToAdd.length > 0) {
        await addToMultiModalStopPlace({
          variables: {
            input: {
              parentSiteRef: terminal.id,
              stopPlaceIds: stopPlacesToAdd,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: ['getParentStopPlaceDetails'],
        });
      }

      if (stopPlacesToRemove.length > 0) {
        await removeFromMultiModalStopPlace({
          variables: {
            parentSiteRef: terminal.id,
            stopPlaceId: stopPlacesToRemove,
          },
          awaitRefetchQueries: true,
          refetchQueries: ['getParentStopPlaceDetails'],
        });
      }
    },
    [upsertTerminal, addToMultiModalStopPlace, removeFromMultiModalStopPlace],
  );

  return {
    upsertTerminalLocationDetails,
    defaultErrorHandler,
  };
};
