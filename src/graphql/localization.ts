/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

// const UPSERT_LOCALIZED_TEXTS_PARAMS_FRAGMENT = gql`
//   fragment upsert_localized_texts_params on localization_localized_texts_insert_input {
//     objects: $localizedTexts
//     on_conflict: { constraint: localized_texts_pkey }
//   }
//   `;

const UPSERT_LOCALIZED_TEXTS_RESPONSE = gql`
  fragment upsert_localized_texts_response on localization_localized_texts_mutation_response {
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

const UPSERT_LOCALIZED_TEXTS = gql`
  mutation UpsertLocalizedTexts(
    $localizedTexts: [localization_localized_texts_insert_input!]!
  ) {
    insert_localization_localized_texts(
      on_conflict: {
        constraint: localized_texts_pkey
        update_columns: localized_text
      }
      objects: {
        entity_id: "b7392804-fa65-41da-b0aa-ca32431d4532"
        localized_text: "localizedText"
        language_code: fi_FI
        codeset: {
          data: { codeset_name: "codesetName" }
          on_conflict: {
            constraint: unique_codeset_name
            update_columns: codeset_name
          }
        }
      }
    ) {
      ...upsert_localized_texts_response
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
