import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  StopRegistryNameType,
  StopRegistryParentStopPlaceInput,
} from '../../../../../../generated/graphql';
import { useUpdateTerminal } from '../../../../../../hooks/stop-registry/terminals';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { patchAlternativeNames, patchKeyValues } from '../../../../../../utils';
import { TerminalFormState } from './schema';

type UpdateTerminalInputs = {
  readonly terminal: EnrichedParentStopPlace;
  readonly state: TerminalFormState;
};

const mapFormStateToInput = ({
  terminal,
  state,
}: UpdateTerminalInputs): StopRegistryParentStopPlaceInput => {
  const { id } = terminal;

  return {
    id,
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
    privateCode: {
      value: state.privateCode,
      type: 'HSL/JORE-4',
    },
    name: {
      value: state.name,
      lang: 'fin',
    },
    description: {
      value: state.description.value ?? '',
      lang: state.description.lang ?? 'fin',
    },
    validBetween: null,
    keyValues: patchKeyValues(
      terminal,
      compact([
        state.terminalType
          ? {
              key: 'terminalType',
              values: [state.terminalType],
            }
          : undefined,
        state.departurePlatforms
          ? {
              key: 'departurePlatforms',
              values: [state.departurePlatforms],
            }
          : undefined,
        state.arrivalPlatforms
          ? {
              key: 'arrivalPlatforms',
              values: [state.arrivalPlatforms],
            }
          : undefined,
        state.loadingPlatforms
          ? {
              key: 'loadingPlatforms',
              values: [state.loadingPlatforms],
            }
          : undefined,
        state.electricCharging
          ? {
              key: 'electricCharging',
              values: [state.electricCharging],
            }
          : undefined,
      ]),
    ),
  };
};

export const useUpdateTerminalDetails = () => {
  const { updateTerminal, defaultErrorHandler } = useUpdateTerminal();

  const updateTerminalDetails = useCallback(
    async (inputs: UpdateTerminalInputs) => {
      const input = mapFormStateToInput(inputs);
      return updateTerminal(input);
    },
    [updateTerminal],
  );

  return {
    updateTerminalDetails,
    defaultErrorHandler,
  };
};
