import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAddToMultiModalStopPlaceMutation,
  useRemoveFromMultiModalStopPlaceMutation,
} from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { SelectedStop } from '../../../../components/SelectMemberStops/common/schema';

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
        version
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
        version
      }
    }
  }
`;

type EditMembersOfTerminalInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly selectedStops?: ReadonlyArray<SelectedStop>;
  readonly isDeleting?: boolean;
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
  isDeleting?: boolean,
): void {
  // When deleting a terminal, we need to be able to remove all members
  if (selectedStopIds.length === 0 && !isDeleting) {
    throw new Error(t('terminalDetails.location.noMemberStopsSelected'));
  }
}

export const useEditMembersOfTerminal = () => {
  const { t } = useTranslation();
  const [addToMultiModalStopPlace] = useAddToMultiModalStopPlaceMutation();
  const [removeFromMultiModalStopPlace] =
    useRemoveFromMultiModalStopPlaceMutation();

  const editMembersOfTerminal = useCallback(
    async (inputs: EditMembersOfTerminalInputs) => {
      const { terminal, selectedStops = [], isDeleting } = inputs;

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

      validateSelectedStops(selectedStopIds, t, isDeleting);

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
    [addToMultiModalStopPlace, removeFromMultiModalStopPlace, t],
  );

  return {
    editMembersOfTerminal,
  };
};
