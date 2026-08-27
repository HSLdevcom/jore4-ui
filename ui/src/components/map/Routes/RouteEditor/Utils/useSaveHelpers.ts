import { RouteDefaultFieldsFragment } from '../../../../../generated/graphql';
import { StopMetaTypeUpdateInfo } from '../../../../LinesAndRoutes/Common';
import {
  SaveBlockers,
  getBlockers,
} from '../../../../LinesAndRoutes/Common/SaveBlockers';
import { useCreateRouteHelper } from './useCreateRouteHelper';
import { useEditRouteHelper } from './useEditRouteHelper';

type PendingChanges = {
  readonly conflicts: ReadonlyArray<RouteDefaultFieldsFragment>;
  readonly stopsNeedingUpdate: ReadonlyArray<StopMetaTypeUpdateInfo>;
};

type SaveHelpersConfirm = {
  readonly pendingChanges: PendingChanges;
  readonly saveBlockers: SaveBlockers;
  readonly onCancelSave: () => void;
  readonly onConfirmSave: () => Promise<unknown>;
  readonly onDoCreate?: never;
  readonly onDoEdit?: never;
};

type SaveHelpersDo = {
  readonly pendingChanges: null;
  readonly saveBlockers: null;
  readonly onCancelSave?: never;
  readonly onConfirmSave?: never;
  readonly onDoCreate: () => Promise<unknown>;
  readonly onDoEdit: () => Promise<unknown>;
};

export function useSaveHelpers(): SaveHelpersConfirm | SaveHelpersDo {
  const { pendingCreateChanges, onCancelCreate, onConfirmCreate, onDoCreate } =
    useCreateRouteHelper();
  const { pendingEditChanges, onCancelEdit, onConfirmEdit, onDoEdit } =
    useEditRouteHelper();

  if (pendingCreateChanges && onConfirmCreate) {
    return {
      pendingChanges: pendingCreateChanges,
      saveBlockers: getBlockers(pendingCreateChanges),
      onCancelSave: onCancelCreate,
      onConfirmSave: onConfirmCreate,
    };
  }

  if (pendingEditChanges && onConfirmEdit) {
    return {
      pendingChanges: pendingEditChanges,
      saveBlockers: getBlockers(pendingEditChanges),
      onCancelSave: onCancelEdit,
      onConfirmSave: onConfirmEdit,
    };
  }

  return { pendingChanges: null, saveBlockers: null, onDoCreate, onDoEdit };
}
