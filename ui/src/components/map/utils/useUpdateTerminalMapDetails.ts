import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  StopRegistryNameType,
  StopRegistryParentStopPlaceInput,
} from '../../../generated/graphql';
import { useUpdateTerminal } from '../../../hooks/stop-registry/terminals';
import { EnrichedParentStopPlace } from '../../../types';
import {
  mapPointToStopRegistryGeoJSON,
  patchAlternativeNames,
  patchKeyValues,
} from '../../../utils';
import { SelectedStop } from '../../stop-registry/components/SelectMemberStops/schema';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { useEditMembersOfTerminal } from '../../stop-registry/terminals/components/location-details/location-details-form/useEditMembersOfTerminal';

type UpdateTerminalInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalFormState;
  readonly selectedStops?: ReadonlyArray<SelectedStop>;
};

const mapFormStateToInput = ({
  terminal,
  state,
}: UpdateTerminalInputs): StopRegistryParentStopPlaceInput => {
  const { id } = terminal;

  const keyValues = patchKeyValues(
    terminal,
    compact([
      state.terminalType
        ? {
            key: 'terminalType',
            values: [state.terminalType],
          }
        : undefined,
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
    name: {
      value: state.name,
      lang: 'fin',
    },
    geometry: mapPointToStopRegistryGeoJSON(state),
    validBetween: null,
    keyValues,
    alternativeNames: patchAlternativeNames(terminal, [
      {
        name: { lang: 'swe', value: state.nameSwe },
        nameType: StopRegistryNameType.Translation,
      },
      {
        name: { lang: 'eng', value: state.nameEng },
        nameType: StopRegistryNameType.Translation,
      },
      {
        name: { lang: 'swe', value: state.abbreviationSwe },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'fin', value: state.abbreviationFin },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'eng', value: state.abbreviationEng },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'fin', value: state.nameLongFin },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'swe', value: state.nameLongSwe },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'eng', value: state.nameLongEng },
        nameType: StopRegistryNameType.Alias,
      },
    ]),
  };
};

export const useUpdateTerminalMapDetails = () => {
  const { updateTerminal, defaultErrorHandler } = useUpdateTerminal();
  const { editMembersOfTerminal } = useEditMembersOfTerminal();

  const updateTerminalMapDetails = useCallback(
    async ({ terminal, state, selectedStops = [] }: UpdateTerminalInputs) => {
      if (!terminal.id) {
        return terminal;
      }

      // Update terminal members first so we get the correct children returned by updateTerminal
      await editMembersOfTerminal({
        terminal,
        selectedStops,
      });

      const input = mapFormStateToInput({ terminal, state });
      const updatedTerminal = await updateTerminal(input);

      return updatedTerminal;
    },
    [editMembersOfTerminal, updateTerminal],
  );

  return {
    updateTerminalMapDetails,
    defaultErrorHandler,
  };
};
