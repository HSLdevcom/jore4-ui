import {
  LocalizationLanguageEnum,
  LocalizationLocalizedTextConstraint,
  LocalizationLocalizedTextInsertInput,
  LocalizationLocalizedTextOnConflict,
  LocalizationLocalizedTextUpdateColumn,
  useGetCodesetsAsyncQuery,
} from '../../generated/graphql';
import { mapCodesetsResult } from '../../graphql';

export type LocalizedText = {
  entityId: UUID;
  languageCode: LocalizationLanguageEnum;
  codesetName: string;
  localizedText?: string;
};

export const useUpsertLocalizedText = () => {
  const [getCodesets] = useGetCodesetsAsyncQuery();

  // builds inputs for upserting localized text
  const buildUpsertLocalizedTestsInput = async (texts: LocalizedText[]) => {
    const codesetsResult = await getCodesets({});
    const codesets = mapCodesetsResult(codesetsResult);

    // if the localized text already exists for the entity, overwrite it!
    const onConflict: LocalizationLocalizedTextOnConflict = {
      constraint: LocalizationLocalizedTextConstraint.LocalizedTextPkey,
      update_columns: [LocalizationLocalizedTextUpdateColumn.LocalizedText],
    };

    const data: Array<LocalizationLocalizedTextInsertInput> = texts.map(
      (item) => {
        // find codeset id
        const codeset = codesets?.find(
          (cs) => cs.codeset_name === item.codesetName,
        );

        if (!codeset) {
          throw new Error(`Codeset ${item.codesetName} not found`);
        }

        return {
          entity_id: item.entityId,
          language_code: item.languageCode,
          codeset_id: codeset.codeset_id,
          localized_text: item.localizedText,
        };
      },
    );

    return { onConflict, data };
  };

  return {
    buildUpsertLocalizedTestsInput,
  };
};
