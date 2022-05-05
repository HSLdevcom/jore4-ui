/* eslint-disable @typescript-eslint/no-unused-vars */

import { gql } from '@apollo/client';

const LOCALIZED_TEXTS_ALL_FIELDS = gql`
  fragment localized_texts_all_fields on localization_localized_text {
    localized_text
    language_code
    attribute {
      attribute_id
      attribute_name
    }
  }
`;
