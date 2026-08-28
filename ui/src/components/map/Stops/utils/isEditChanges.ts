import { CreateChanges, EditChanges } from '../Types';

export function isEditChanges(
  changes: EditChanges | CreateChanges,
): changes is EditChanges {
  return 'editedStop' in changes;
}

export function isCreateChanges(
  changes: EditChanges | CreateChanges,
): changes is CreateChanges {
  return !isEditChanges(changes);
}
