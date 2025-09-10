import { useTranslation } from 'react-i18next';
import { useAppAction } from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { showSuccessToast } from '../../../utils';
import { useLoader } from '../../common/hooks/useLoader';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { useCreateTerminal } from '../../stop-registry/terminals/hooks';

export const useTerminalCreation = () => {
  const { t } = useTranslation();

  const { createTerminal, defaultErrorHandler } = useCreateTerminal();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

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
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }

    setIsLoading(false);
  };

  return {
    doCreateTerminal,
  };
};
