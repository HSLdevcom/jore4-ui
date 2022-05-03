/* eslint-disable @typescript-eslint/no-unused-vars */

import { gql } from '@apollo/client';
import { GetCodesetsQuery, LocalizationCodeset } from '../generated/graphql';
import { GqlQueryResult } from './types';

const UPSERT_LOCALIZED_TEXTS_RESPONSE = gql`
  fragment upsert_localized_texts_response on localization_localized_text_mutation_response {
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

const GET_CODESETS = gql`
  query GetCodesets {
    localization_codeset {
      codeset_id
      codeset_name
    }
  }
`;

export const mapCodesetsResult = (result: GqlQueryResult<GetCodesetsQuery>) =>
  result.data?.localization_codeset as LocalizationCodeset[] | undefined;

// const UPSERT_LOCALIZED_TEXTS_PARAMS_FRAGMENT = gql`
//   fragment upsert_localized_texts_params on localization_localized_texts_insert_input {
//     objects: $localizedTexts
//     on_conflict: { constraint: localized_texts_pkey }
//   }
//   `;

// const UPSERT_LOCALIZED_TEXTS_ARGS = gql`
//   fragment upsert_localized_texts_args on insert_localization_localized_texts_args {
//     on_conflict: {
//       constraint: localized_texts_pkey
//       update_columns: localized_text
//     }
//   }
// `;

// const UPSERT_LOCALIZED_TEXTS = gql`
//   mutation UpsertLocalizedTexts(
//     $localizedTextsOnConflict: localization_localized_texts_on_conflict!
//     $localizedTextObjects: [localization_localized_texts_insert_input!]!
//   ) {
//     insert_localization_localized_texts(
//       on_conflict: $localizedTextsOnConflict
//       objects: $localizedTextObjects
//     ) {
//       ...upsert_localized_texts_response
//     }
//   }
// `;

// const insert = /* GraphQL */ `insert_localization_localized_texts(
//   on_conflict: $localizedTextsOnConflict
//   objects: $localizedTextObjects
// ) {
//   ...upsert_localized_texts_response
// }`;

// const foo = /* GraphQL */ `
//   mutation UpsertLocalizedTexts(
//     $localizedTextsOnConflict: localization_localized_texts_on_conflict!
//     $localizedTextObjects: [localization_localized_texts_insert_input!]!
//   ) {
//     ${insert}
//   }
// `;

// const UPSERT_LOCALIZED_TEXTS = gql(`
// mutation UpsertLocalizedTexts(
//   $localizedTextsOnConflict: localization_localized_texts_on_conflict!
//   $localizedTextObjects: [localization_localized_texts_insert_input!]!
// ) {
//   insert_localization_localized_texts(
//     on_conflict: $localizedTextsOnConflict
//     objects: $localizedTextObjects
//   ) {
//     ...upsert_localized_texts_response
//   }
// }
// `);

// should just use sql functions...

// on_conflict: {
//   constraint: localized_texts_pkey
//   update_columns: localized_text
// }
// objects: {
//   entity_id: "b7392804-fa65-41da-b0aa-ca32431d4532"
//   localized_text: "localizedText"
//   language_code: fi_FI
//   codeset: {
//     data: { codeset_name: "codesetName" }
//     on_conflict: {
//       constraint: unique_codeset_name
//       update_columns: codeset_name
//     }
//   }
// }
