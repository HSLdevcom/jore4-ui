import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryParentStopPlaceInput,
  useAddToMultiModalStopPlaceMutation,
  useRemoveFromMultiModalStopPlaceMutation,
} from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { patchKeyValues } from '../../../../../../utils';
import { SelectedStop } from '../../../../components/SelectMemberStops/schema';
import { useUpdateTerminal } from '../../../useUpdateTerminal';
import { TerminalLocationDetailsFormState } from './schema';

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

function getExistingChildrenIds(
  terminal: Readonly<EnrichedParentStopPlace>,
): string[] {
  return compact(terminal.children?.map((child) => child?.id));
}

function getSelectedStopIds(
  selectedStops: ReadonlyArray<SelectedStop>,
): string[] {
  return selectedStops.map((stop) => stop.stopPlaceId);
}

function getStopPlacesToAdd(
  selectedStopIds: readonly string[],
  existingChildrenIds: readonly string[],
): string[] {
  return selectedStopIds.filter((id) => !existingChildrenIds.includes(id));
}

function getStopPlacesToRemove(
  existingChildrenIds: readonly string[],
  selectedStopIds: readonly string[],
): string[] {
  return existingChildrenIds.filter((id) => !selectedStopIds.includes(id));
}

function validateSelectedStops(
  selectedStopIds: readonly string[],
  t: (key: string) => string,
): void {
  if (selectedStopIds.length === 0) {
    throw new Error(t('terminalDetails.location.noMemberStopsSelected'));
  }
}

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
  const { t } = useTranslation();
  const { updateTerminal, defaultErrorHandler } = useUpdateTerminal();
  const [addToMultiModalStopPlace] = useAddToMultiModalStopPlaceMutation();
  const [removeFromMultiModalStopPlace] =
    useRemoveFromMultiModalStopPlaceMutation();

  const upsertTerminalLocationDetails = useCallback(
    async (inputs: UpsertTerminalInputs) => {
      const { terminal, state, selectedStops = [] } = inputs;

      const terminalInput = mapFormStateToInput({ terminal, state });
      await updateTerminal(terminalInput);

      if (!terminal.id) {
        return;
      }

      const existingChildrenIds = getExistingChildrenIds(terminal);
      const selectedStopIds = getSelectedStopIds(selectedStops);

      const stopPlacesToAdd = getStopPlacesToAdd(
        selectedStopIds,
        existingChildrenIds,
      );
      const stopPlacesToRemove = getStopPlacesToRemove(
        existingChildrenIds,
        selectedStopIds,
      );

      validateSelectedStops(selectedStopIds, t);

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
    [
      updateTerminal,
      addToMultiModalStopPlace,
      removeFromMultiModalStopPlace,
      t,
    ],
  );

  return {
    upsertTerminalLocationDetails,
    defaultErrorHandler,
  };
};
