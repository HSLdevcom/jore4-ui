import React, { useContext } from 'react';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { FormState } from '../forms/CreateRouteForm';
import { CreateRouteModal } from './CreateRouteModal';

export const Routes: React.FC = () => {
  const {
    state: { routeDetails, drawingMode },
    dispatch,
  } = useContext(MapEditorContext);

  const showCreateForm = !routeDetails && drawingMode === Mode.Draw;

  const onCancel = () => {
    dispatch({ type: 'reset' });
  };
  const onClose = () => {
    dispatch({ type: 'reset' });
  };

  const onSuccess = (data: FormState) => {
    dispatch({ type: 'setState', payload: { routeDetails: data } });
  };

  const defaultValues: Partial<FormState> = routeDetails || {};

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
