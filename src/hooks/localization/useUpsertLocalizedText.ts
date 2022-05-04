import {
  LocalizationLanguageEnum,
  LocalizationLocalizedTextArrRelInsertInput,
  LocalizationLocalizedTextConstraint,
  LocalizationLocalizedTextInsertInput,
  LocalizationLocalizedTextOnConflict,
  LocalizationLocalizedTextUpdateColumn,
  useGetAttributesAsyncQuery,
} from '../../generated/graphql';
import { mapAttributesResult } from '../../graphql';

export type AttributeName =
  | 'route_description'
  | 'line_name'
  | 'line_short_name';

export type LocalizedText = {
  entityId?: UUID; // for objects that are just being created, we don't have an entityId yet
  languageCode: LocalizationLanguageEnum;
  attributeName: AttributeName;
  localizedText?: string;
};

export type LocalizationLocalizedTextUpsertInput = {
  data: LocalizationLocalizedTextInsertInput[];
  onConflict: LocalizationLocalizedTextOnConflict;
};

export const useUpsertLocalizedText = () => {
  const [getAttributes] = useGetAttributesAsyncQuery();

  // builds inputs for upserting localized text
  const buildUpsertLocalizedTestsInput = async (texts: LocalizedText[]) => {
    const attributesResult = await getAttributes({});
    const attributes = mapAttributesResult(attributesResult);

    // if the localized text already exists for the entity, overwrite it!
    const onConflict: LocalizationLocalizedTextOnConflict = {
      constraint: LocalizationLocalizedTextConstraint.LocalizedTextPkey,
      update_columns: [LocalizationLocalizedTextUpdateColumn.LocalizedText],
    };

    const data: LocalizationLocalizedTextInsertInput[] = texts.map((item) => {
      // find attribute id
      const attribute = attributes?.find(
        (attr) => attr.attribute_name === item.attributeName,
      );

      if (!attribute) {
        throw new Error(`Attribute ${item.attributeName} not found`);
      }

      return {
        entity_id: item.entityId,
        language_code: item.languageCode,
        attribute_id: attribute.attribute_id,
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
