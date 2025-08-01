import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppAction, useLoader } from '../../../hooks';
import { useDeleteTerminal } from '../../../hooks/stop-registry/terminals';
import {
  MapEntityEditorViewState,
  Operation,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { EnrichedParentStopPlace } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { useEditMembersOfTerminal } from '../../stop-registry/terminals/components/location-details/location-details-form/useEditMembersOfTerminal';

const getMemberStops = (terminal: EnrichedParentStopPlace): string => {
  const quayCodes =
    terminal.children
      ?.flatMap((child) => child?.quays ?? [])
      .map((quay) => quay?.publicCode)
      .filter(Boolean)
      .sort() ?? [];

  return quayCodes.length ? quayCodes.join(', ') : '-';
};

const getMemberStopsTotal = (terminal: EnrichedParentStopPlace): number => {
  return (
    terminal.children?.reduce(
      (total, child) => total + (child?.quays?.length ?? 0),
      0,
    ) ?? 0
  );
};

const getDeleteTerminalDescription = ({
  terminal,
  t,
}: {
  terminal: EnrichedParentStopPlace;
  t: TFunction;
}) => {
  const count = getMemberStopsTotal(terminal);
  const memberStops = getMemberStops(terminal);

  return (
    <span className="inline-flex flex-col gap-2">
      <span>{t('confirmDeleteTerminalDialog.description', { count })}</span>
      <span className="font-bold">{memberStops}</span>
      <span>{t('confirmDeleteTerminalDialog.deleteTerminalDescription')}</span>
    </span>
  );
};

type DeleteTerminalProps = {
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
  readonly terminal: EnrichedParentStopPlace;
};

export const DeleteTerminal: FC<DeleteTerminalProps> = ({
  isOpen,
  setIsOpen,
  terminal,
}) => {
  const { t } = useTranslation();

  const { editMembersOfTerminal } = useEditMembersOfTerminal();
  const { deleteTerminal } = useDeleteTerminal();

  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

  const doDeleteTerminal = async (terminalId: string) => {
    setIsLoading(true);

    try {
      // We first have to remove all members of the terminal, otherwise the terminal cannot be deleted
      await editMembersOfTerminal({
        terminal,
        selectedStops: [],
        isDeleting: true,
      });

      await deleteTerminal(terminalId);

      showSuccessToast(t('terminal.deleteSuccess'));
      setEditedTerminalData(undefined);
      setSelectedTerminalId(undefined);
      setMapTerminalViewState(MapEntityEditorViewState.NONE);
    } catch (err) {
      showDangerToastWithError(t('errors.deleteFailed'), err);
    }
    setIsLoading(false);
  };

  const onConfirmDeleteTerminal = async () => {
    if (!terminal.id) {
      return;
    }

    await doDeleteTerminal(terminal.id);
    setIsOpen(false);
  };

  const onCancelDeleteTerminal = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onCancel={onCancelDeleteTerminal}
      onConfirm={onConfirmDeleteTerminal}
      title={t('confirmDeleteTerminalDialog.title')}
      description={getDeleteTerminalDescription({ terminal, t })}
      confirmText={t('confirmDeleteTerminalDialog.confirmText')}
      cancelText={t('cancel')}
      widthClassName="w-235"
    />
  );
};
