import { gql } from '@apollo/client';

const UPSERT_LOCALIZED_TEXTS_PARAMS_FRAGMENT = gql`
  fragment upsert_localized_texts_params on localization_localized_texts_insert_input {
    objects: $localizedTexts
    on_conflict: { constraint: localized_texts_pkey }
  }
  `;

const UPSERT_LOCALIZED_TEXTS_RESPONSE_FRAGMENT = gql`
  fragment upsert_localized_texts_response on localization_localized_texts_insert_response {
    returning {
      entity_id
      language_code
      codeset {
        codeset_id
        codeset_name
      }
      localized_text
    }
  }
`;

export const UPSERT_LOCALIZED_TEXTS = gql`
  mutation UpsertLocalizedTexts(
    $localizedTexts: [localization_localized_texts_insert_input!]!
  ) {
    insert_localization_localized_texts(
      objects: $localizedTexts
      on_conflict: { constraint: localized_texts_pkey }
    ) {
      returning {
        entity_id
        language_code
        codeset {
          codeset_id
          codeset_name
        }
        localized_text
      }
    }
  }
`;

// export const UPSERT_LOCALIZED_TEXTS = gql`
//   mutation UpsertLocalizedTexts(
//     $localizedTexts: [localization_localized_texts_insert_input!]!
//   ) {
//     insert_localization_localized_texts(
//       ...upsert_localized_texts_params
//     ) {
//       ...upsert_localized_texts_response
//     }
//   }
// `;
