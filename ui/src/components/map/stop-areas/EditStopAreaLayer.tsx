import { useEffect, useState } from 'react';
import {
  StopRegistryGroupOfStopPlaces,
  StopRegistryGroupOfStopPlacesInput,
} from '../../../generated/graphql';
import { useAppAction, useLoader, useUpsertStopArea } from '../../../hooks';
import { Operation, setEditedStopAreaDataAction } from '../../../redux';
import { StopRegistryGeoJsonDefined } from '../../../utils';
import { EditStopAreaModal } from './EditStopAreaModal';
import { mapStopAreaDataToFormState } from './StopAreaForm';
import { StopAreaPopup } from './StopAreaPopup';

enum StopAreaEditorViews {
  None,
  Popup,
  Modal,
}

type EditStopAreaLayerProps = {
  editedArea: StopRegistryGroupOfStopPlaces;
  onEditingFinished?: () => void;
  onPopupClose: () => void;
};

export const EditStopAreaLayer = ({
  editedArea,
  onEditingFinished,
  onPopupClose,
}: EditStopAreaLayerProps) => {
  const [displayedEditor, setDisplayedEditor] = useState<StopAreaEditorViews>(
    StopAreaEditorViews.None,
  );
  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);
  const { setIsLoading } = useLoader(Operation.SaveStopArea);

  const isExistingStopArea = !!editedArea.id;
  const defaultDisplayedEditor = isExistingStopArea
    ? StopAreaEditorViews.Popup
    : StopAreaEditorViews.Modal;

  useEffect(() => {
    setDisplayedEditor(defaultDisplayedEditor);
  }, [defaultDisplayedEditor]);

  const onCloseEditors = () => {
    setEditedStopAreaData(undefined);
    setDisplayedEditor(StopAreaEditorViews.None);
    onPopupClose();
  };

  const onFinishEditing = () => {
    onCloseEditors();

    if (onEditingFinished) {
      onEditingFinished();
    }
  };

  const onStopAreaFormSubmit = async (
    changes: StopRegistryGroupOfStopPlacesInput,
  ) => {
    setIsLoading(true);
    try {
      await upsertStopArea(changes);
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {displayedEditor === StopAreaEditorViews.Popup && (
        <StopAreaPopup area={editedArea} onClose={onCloseEditors} />
      )}
      {displayedEditor === StopAreaEditorViews.Modal && (
        <EditStopAreaModal
          defaultValues={mapStopAreaDataToFormState(
            editedArea as StopRegistryGroupOfStopPlaces & {
              geometry: StopRegistryGeoJsonDefined;
            },
          )}
          onCancel={onCloseEditors}
          onClose={onCloseEditors}
          onSubmit={onStopAreaFormSubmit}
        />
      )}
    </>
  );
};
