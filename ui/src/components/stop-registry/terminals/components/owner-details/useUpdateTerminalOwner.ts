import compact from 'lodash/compact';
import pick from 'lodash/pick';
import { useCallback } from 'react';
import {
  StopRegistryParentStopPlaceInput,
  StopRegistryStopPlaceOrganisationRelationshipType,
} from '../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../types';
import { KeyValueKeysEnum, patchKeyValues } from '../../../../../utils';
import { useUpdateTerminal } from '../../hooks';
import { TerminalOwnerFormState } from './terminalOwnerSchema';

type UpdateTerminalOwnerInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalOwnerFormState;
};

const mapFormStateToInput = ({
  terminal,
  state,
}: UpdateTerminalOwnerInputs): StopRegistryParentStopPlaceInput => {
  const { id } = terminal;

  return {
    id,
    organisations: compact(terminal.organisations)
      .map((org) => pick(org, 'organisationRef', 'relationshipType'))
      .filter(
        (it) =>
          it.relationshipType !==
          StopRegistryStopPlaceOrganisationRelationshipType.Owner,
      )
      .concat(
        state.ownerRef
          ? {
              organisationRef: state.ownerRef,
              relationshipType:
                StopRegistryStopPlaceOrganisationRelationshipType.Owner,
            }
          : [],
      ),
    keyValues: patchKeyValues(terminal, [
      {
        key: KeyValueKeysEnum.OwnerContractId,
        values: [state.contractId ?? ''],
      },
      { key: KeyValueKeysEnum.OwnerNote, values: [state.note ?? ''] },
    ]),
  };
};

export function useUpdateTerminalOwner() {
  const { updateTerminal, defaultErrorHandler } = useUpdateTerminal();

  const updateOwner = useCallback(
    async (inputs: UpdateTerminalOwnerInputs) => {
      const input = mapFormStateToInput(inputs);
      return updateTerminal(input);
    },
    [updateTerminal],
  );

  return {
    updateOwner,
    defaultErrorHandler,
  };
}
