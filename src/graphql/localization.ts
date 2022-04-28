/* eslint-disable @typescript-eslint/no-unused-vars */

import { gql } from '@apollo/client';
import {
  GetAttributesQuery,
  LocalizationAttribute,
} from '../generated/graphql';
import { GqlQueryResult } from './types';

const LOCALIZED_TEXTS_MUTATION_RESPONSE = gql`
  fragment localized_texts_mutation_response on localization_localized_text_mutation_response {
    returning {
      entity_id
      language_code
      attribute {
        attribute_id
        attribute_name
      }
      localized_text
    }
  }
`;

const GET_ATTRIBUTES = gql`
  query GetAttributes {
    localization_attribute {
      attribute_id
      attribute_name
    }
  }
`;

export const mapAttributesResult = (
  result: GqlQueryResult<GetAttributesQuery>,
) => result.data?.localization_attribute as LocalizationAttribute[] | undefined;
