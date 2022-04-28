import {
  LocalizationLanguageEnum,
  LocalizationLocalizedTextBoolExp,
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

export type LocalizedTextMutationInputs = {
  toUpsert: LocalizationLocalizedTextInsertInput[];
  onConflict: LocalizationLocalizedTextOnConflict;
  toDelete: LocalizationLocalizedTextBoolExp;
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

    const toUpsert: LocalizationLocalizedTextInsertInput[] = [];
    const toDelete: LocalizationLocalizedTextBoolExp = { _or: [] };

    texts.forEach((item) => {
      // find attribute id
      const attribute = attributes?.find(
        (attr) => attr.attribute_name === item.attributeName,
      );

      if (!attribute) {
        throw new Error(`Attribute ${item.attributeName} not found`);
      }

      if (item.localizedText && item.localizedText.length > 0) {
        toUpsert.push({
          entity_id: item.entityId,
          language_code: item.languageCode,
          attribute_id: attribute.attribute_id,
          localized_text: item.localizedText,
        });
      } else {
        if (!item.entityId) {
          throw new Error(`Entiy ID must be defined!`);
        }

        const toDeleteItem: LocalizationLocalizedTextBoolExp = {
          entity_id: { _eq: item.entityId },
          language_code: { _eq: item.languageCode },
          attribute_id: { _eq: attribute.attribute_id },
        };
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, no-underscore-dangle
        toDelete._or!.push(toDeleteItem);
      }
    });

    const upsertInput: LocalizedTextMutationInputs = {
      toUpsert,
      onConflict,
      toDelete,
    };

    return upsertInput;
  };

  return {
    buildUpsertLocalizedTestsInput,
  };
};
