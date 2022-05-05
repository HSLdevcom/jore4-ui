import { gql } from '@apollo/client';

export const LOCALIZED_TEXTS_ALL_FIELDS = gql`
  fragment localized_texts_all_fields on localization_localized_text {
    entity_id
    localized_text
    language_code
    attribute {
      attribute_id
      attribute_name
    }
  }
`;
