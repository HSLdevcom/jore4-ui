type HasSavableDirtyFieldsOptions = {
  readonly dirtyFields: unknown;
  readonly ignoredFields?: ReadonlyArray<string>;
};

export function hasSavableDirtyFields({
  dirtyFields,
  ignoredFields = [],
}: HasSavableDirtyFieldsOptions): boolean {
  if (!dirtyFields || typeof dirtyFields !== 'object') {
    return false;
  }

  return Object.entries(dirtyFields).some(([key, value]) => {
    if (ignoredFields.includes(key)) {
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (!value || typeof value !== 'object') {
      return false;
    }

    return hasSavableDirtyFields({
      dirtyFields: value,
      ignoredFields,
    });
  });
}
