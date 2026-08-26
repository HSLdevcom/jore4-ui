import { useTranslation } from 'react-i18next';
import {
  MapEntityEditorViewState,
  MapEntityType,
  Operation,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
  useAppAction,
  useLoader,
} from '../../../redux';
import { showSuccessToast } from '../../../utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { useCreateTerminal } from '../../stop-registry/terminals/hooks';
import { useEnsureMapEntityTypeVisible } from '../Utils/useEnsureMapEntityTypeVisible';
import { useSetMapObservationDate } from '../Utils/useSetObservationDate';

export function useTerminalCreation() {
  const { t } = useTranslation();

  const { createTerminal, defaultErrorHandler } = useCreateTerminal();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const setMapObservationDate = useSetMapObservationDate();
  const ensureMapEntityTypeVisible = useEnsureMapEntityTypeVisible();

  const doCreateTerminal = async (state: TerminalFormState) => {
    setIsLoading(true);

    try {
      const createdTerminal = await createTerminal({
        state,
      });

      showSuccessToast(t(($) => $.terminal.saveSuccess));
      ensureMapEntityTypeVisible(MapEntityType.Terminal);
      setMapObservationDate(createdTerminal);
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
}
