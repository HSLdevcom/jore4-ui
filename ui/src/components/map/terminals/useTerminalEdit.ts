import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  selectEditedTerminalData,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { useUpdateTerminalMapDetails } from '../utils/useUpdateTerminalMapDetails';

export const useTerminalEdit = () => {
  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

  const { updateTerminalMapDetails, defaultErrorHandler } =
    useUpdateTerminalMapDetails();

  const editedTerminalData = useAppSelector(selectEditedTerminalData);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const doUpdateTerminal = async (state: TerminalFormState) => {
    if (!editedTerminalData) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedTerminal = await updateTerminalMapDetails({
        terminal: editedTerminalData,
        state,
        selectedStops: state.selectedStops,
      });

      setEditedTerminalData(updatedTerminal ?? undefined);
      setSelectedTerminalId(updatedTerminal?.id ?? undefined);
      setMapTerminalViewState(MapEntityEditorViewState.POPUP);
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }

    setIsLoading(false);
  };

  return {
    doUpdateTerminal,
  };
};
