import {
  LocalizationLanguagesEnum,
  LocalizationLocalizedTextsInsertInput,
  UpsertLocalizedTextsMutationVariables,
} from '../generated/graphql';

export type LocalizedText = {
  entityId: UUID;
  languageCode: LocalizationLanguagesEnum;
  codesetName: string;
  localizedText?: string;
};

export const useCreateLocalizedText = () => {
  const mapToLocalizedTextInput = (
    texts: LocalizedText[],
  ): UpsertLocalizedTextsMutationVariables => {
    const objects = texts.map((text) => {
      const insertInput: LocalizationLocalizedTextsInsertInput = {
        entity_id: text.entityId,
        codeset: {
          data: {
            codeset_name: text.codesetName,
          },
        },
        language_code: text.languageCode,
        localized_text: text.localizedText,
      };
      return insertInput;
    });
    return { objects };
  };

  return {
    mapToLocalizedTextInput,
  };
};
