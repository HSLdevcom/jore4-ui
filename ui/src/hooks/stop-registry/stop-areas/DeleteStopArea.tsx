import React, { FC, useState } from 'react';
import { useDeleteStopArea, useLoader } from '../..';
import { ConfirmStopAreaDeletionDialog } from '../../../components/forms/stop-area';
import { Operation } from '../../../redux';
import { EnrichedStopPlace } from '../../../types';

type DeleteStopAreaProps = {
  readonly stopArea: EnrichedStopPlace;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onDeleteSuccess: () => void;
  readonly defaultErrorHandler: (err: Error) => void;
};

export const useStopAreaDeletion = () => {
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const openDeleteDialog = () => {
    setIsConfirmDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsConfirmDeleteDialogOpen(false);
  };

  return {
    isConfirmDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
  };
};

export const DeleteStopArea: FC<DeleteStopAreaProps> = ({
  stopArea,
  isOpen,
  onClose,
  onDeleteSuccess,
  defaultErrorHandler,
}) => {
  const { deleteStopArea } = useDeleteStopArea();
  const { setIsLoading } = useLoader(Operation.ModifyStopArea);

  const onConfirmDeleteStopArea = async () => {
    const stopAreaId = stopArea.id;
    if (!stopAreaId) {
      // Shouldn't really end up here ever since we only delete persisted stop areas = have id.
      return;
    }

    setIsLoading(true);
    try {
      await deleteStopArea(stopAreaId);
      onClose();
      onDeleteSuccess();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  return (
    <ConfirmStopAreaDeletionDialog
      onCancel={onClose}
      onConfirm={onConfirmDeleteStopArea}
      isOpen={isOpen}
      stopArea={stopArea}
    />
  );
};
