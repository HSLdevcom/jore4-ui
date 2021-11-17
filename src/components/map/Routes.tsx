import React, { useContext } from 'react';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { FormState } from '../forms/CreateRouteForm';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const { lineId, setLineId, drawingMode } = useContext(MapEditorContext);

  const showCreateForm = !lineId && drawingMode === Mode.Draw;

  // TODO decide what to do if user closes the route modal without filling in any details
  // jumping back to previous page in history...?
  const onCancel = () => {
    console.log('onCancel');
  };
  const onClose = () => {
    console.log('onClose');
  };

  const onSuccess = (data: FormState) => {
    setLineId(data.on_line_id);
  };

  const defaultValues: Partial<FormState> = {
    on_line_id: lineId,
  };

  return (
    <>
      {showCreateForm && (
        <CreateRouteModal
          defaultValues={defaultValues}
          onSuccess={onSuccess}
          onCancel={onCancel}
          onClose={onClose}
        />
      )}
    </>
  );
};
