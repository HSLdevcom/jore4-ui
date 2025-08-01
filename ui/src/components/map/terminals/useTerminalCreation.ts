import { useTranslation } from 'react-i18next';
import { useAppAction, useLoader } from '../../../hooks';
import { useCreateTerminal } from '../../../hooks/stop-registry/terminals';
import {
  MapEntityEditorViewState,
  Operation,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
  setTerminalDraftLocationAction,
} from '../../../redux';
import { showSuccessToast } from '../../../utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';

export const useTerminalCreation = () => {
  const { t } = useTranslation();

  const { createTerminal, defaultErrorHandler } = useCreateTerminal();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);
  const setDraftLocation = useAppAction(setTerminalDraftLocationAction);

  const doCreateTerminal = async (state: TerminalFormState) => {
    setIsLoading(true);

    try {
      const createdTerminal = await createTerminal({
        state,
      });

      showSuccessToast(t('terminal.saveSuccess'));
      setEditedTerminalData(createdTerminal ?? undefined);
      setSelectedTerminalId(createdTerminal?.id ?? undefined);
      setMapTerminalViewState(MapEntityEditorViewState.POPUP);
      setDraftLocation(undefined);
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }

    setIsLoading(false);
  };

  return {
    doCreateTerminal,
  };
};
