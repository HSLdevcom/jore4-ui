import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  MemberStopQuayDetailsFragment,
  MemberStopStopPlaceDetailsFragment,
} from '../../../../../../generated/graphql';
import { Operation } from '../../../../../../redux';
import { mapToISODate } from '../../../../../../time';
import { EnrichedParentStopPlace } from '../../../../../../types';
import {
  findKeyValue,
  notNullish,
  showDangerToastWithError,
} from '../../../../../../utils';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { SelectedStop } from '../../../../components/SelectMemberStops/common';
import { useEditMembersOfTerminal } from '../../location-details/location-details-form/useEditMembersOfTerminal';
import {
  TerminalAddStopsFormState,
  terminalAddStopsFormSchema,
} from './schema';
import { useLoader } from '../../../../../common/hooks/useLoader';

function mapQuayToSelectedStop(
  terminal: EnrichedParentStopPlace,
  stopPlace: MemberStopStopPlaceDetailsFragment,
  quay: MemberStopQuayDetailsFragment,
): SelectedStop {
  const validityStart = mapToISODate(findKeyValue(quay, 'validityStart'));
  const validityEnd = mapToISODate(findKeyValue(quay, 'validityEnd'));

  return {
    stopPlaceId: stopPlace?.id ?? '',
    stopPlaceParentId: terminal.id ?? null,
    name: stopPlace?.name?.value ?? '',
    quayId: quay?.id ?? '',
    publicCode: quay?.publicCode ?? '',
    validityStart: validityStart ?? '',
    validityEnd: validityEnd ?? '',
    indefinite: !validityEnd,
  };
}

function mapTerminalDataToFormState(
  terminal: EnrichedParentStopPlace,
): TerminalAddStopsFormState {
  return {
    selectedStops:
      terminal.children
        ?.filter(notNullish)
        .flatMap(
          (child) =>
            child.quays
              ?.filter(notNullish)
              .map((quay) => mapQuayToSelectedStop(terminal, child, quay)) ??
            [],
        ) ?? [],
  };
}

export const useAddMemberStopsFormUtils = (
  terminal: EnrichedParentStopPlace,
) => {
  const { t } = useTranslation();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);
  const { editMembersOfTerminal } = useEditMembersOfTerminal();

  const defaultValues = useMemo(
    () => mapTerminalDataToFormState(terminal),
    [terminal],
  );

  const methods = useForm<TerminalAddStopsFormState>({
    defaultValues,
    resolver: zodResolver(terminalAddStopsFormSchema),
  });

  useDirtyFormBlockNavigation(methods.formState, 'TerminalMemberStopsForm');

  const onFormSubmit = async (
    state: TerminalAddStopsFormState,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    setIsLoading(true);

    try {
      await editMembersOfTerminal({
        terminal,
        selectedStops: state.selectedStops,
      });

      onSuccess();
    } catch (err) {
      onError();
      showDangerToastWithError(
        t('terminalDetails.errors.editMemberStops'),
        err,
      );
    }

    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
