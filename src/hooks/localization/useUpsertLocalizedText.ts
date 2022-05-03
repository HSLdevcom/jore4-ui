import {
  LocalizationLanguageEnum,
  LocalizationLocalizedTextArrRelInsertInput,
  LocalizationLocalizedTextConstraint,
  LocalizationLocalizedTextInsertInput,
  LocalizationLocalizedTextOnConflict,
  LocalizationLocalizedTextUpdateColumn,
  useGetCodesetsAsyncQuery,
} from '../../generated/graphql';
import { mapCodesetsResult } from '../../graphql';

export type CodesetName = 'route_description' | 'line_name' | 'line_short_name';

export type LocalizedText = {
  entityId?: UUID; // for objects that are just being created, we don't have an entityId yet
  languageCode: LocalizationLanguageEnum;
  codesetName: CodesetName;
  localizedText?: string;
};

export type LocalizationLocalizedTextUpsertInput = {
  data: LocalizationLocalizedTextInsertInput[];
  onConflict: LocalizationLocalizedTextOnConflict;
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

    const data: LocalizationLocalizedTextInsertInput[] = texts.map((item) => {
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
    });

    const upsertInput: LocalizationLocalizedTextArrRelInsertInput = {
      data,
      on_conflict: onConflict,
    };

    return upsertInput;
  };

  return {
    buildUpsertLocalizedTestsInput,
  };
};
