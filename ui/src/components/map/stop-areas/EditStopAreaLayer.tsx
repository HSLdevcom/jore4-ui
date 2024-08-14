import { MapLayerMouseEvent } from 'maplibre-gl';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { StopRegistryGroupOfStopPlaces } from '../../../generated/graphql';
import {
  useAppAction,
  useAppSelector,
  useLoader,
  useUpsertStopArea,
} from '../../../hooks';
import {
  Operation,
  selectIsMoveStopAreaModeEnabled,
  setEditedStopAreaDataAction,
  setIsMoveStopAreaModeEnabledAction,
} from '../../../redux';
import {
  StopRegistryGeoJsonDefined,
  mapPointToStopRegistryGeoJSON,
} from '../../../utils';
import { EditStopAreaLayerRef } from '../refTypes';
import { EditStopAreaModal } from './EditStopAreaModal';
import { mapStopAreaDataToFormState } from './StopAreaForm';
import { StopAreaFormState } from './stopAreaFormSchema';
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

export const EditStopAreaLayer = forwardRef<
  EditStopAreaLayerRef,
  EditStopAreaLayerProps
>(({ editedArea, onEditingFinished, onPopupClose }, ref) => {
  const [displayedEditor, setDisplayedEditor] = useState<StopAreaEditorViews>(
    StopAreaEditorViews.None,
  );
  const isMoveStopAreaModeEnabled = useAppSelector(
    selectIsMoveStopAreaModeEnabled,
  );

  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);
  const setIsMoveStopAreaModeEnabled = useAppAction(
    setIsMoveStopAreaModeEnabledAction,
  );
  const { setIsLoading } = useLoader(Operation.SaveStopArea);

  const isExistingStopArea = !!editedArea.id;
  const defaultDisplayedEditor = isExistingStopArea
    ? StopAreaEditorViews.Popup
    : StopAreaEditorViews.Modal;

  useEffect(() => {
    if (!isMoveStopAreaModeEnabled) {
      setDisplayedEditor(defaultDisplayedEditor);
    }
  }, [defaultDisplayedEditor, isMoveStopAreaModeEnabled]);

  const onEditStopArea = () => {
    setDisplayedEditor(StopAreaEditorViews.Modal);
  };

  const hideEditors = () => {
    setDisplayedEditor(StopAreaEditorViews.None);
  };

  const onStartMoveStopArea = () => {
    hideEditors();
    setIsMoveStopAreaModeEnabled(true);
  };

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

  const onStopAreaFormSubmit = async (state: StopAreaFormState) => {
    setIsLoading(true);
    try {
      await upsertStopArea({ stopArea: editedArea, state });
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  const onMoveStopArea = async (e: MapLayerMouseEvent) => {
    const [longitude, latitude] = e.lngLat.toArray();
    const geometry = mapPointToStopRegistryGeoJSON({
      longitude,
      latitude,
    });

    const stopAreaFormState = mapStopAreaDataToFormState({
      ...editedArea,
      geometry,
    });
    // An existing stop area, so all required properties have already been persisted -> safe to cast.
    await onStopAreaFormSubmit(
      stopAreaFormState as Required<StopAreaFormState>,
    );
    setIsMoveStopAreaModeEnabled(false);
    onFinishEditing();
  };

  useImperativeHandle(ref, () => ({
    onMoveStopArea: async (e: MapLayerMouseEvent) => onMoveStopArea(e),
  }));

  return (
    <>
      {displayedEditor === StopAreaEditorViews.Popup && (
        <StopAreaPopup
          area={editedArea}
          onEdit={onEditStopArea}
          onMove={onStartMoveStopArea}
          onClose={onCloseEditors}
        />
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
});

EditStopAreaLayer.displayName = 'EditStopAreaLayer';
