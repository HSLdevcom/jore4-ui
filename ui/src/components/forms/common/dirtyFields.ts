export const hasSavableDirtyFields = (
  dirtyFields: unknown,
  ignoredFieldNames: ReadonlyArray<string> = [],
): boolean => {
  if (!dirtyFields || typeof dirtyFields !== 'object') {
    return false;
  }

  return Object.entries(dirtyFields).some(([key, value]) => {
    if (ignoredFieldNames.includes(key)) {
      return false;
    }

    if (value === true) {
      return true;
    }

    return hasSavableDirtyFields(value, ignoredFieldNames);
  });
};
