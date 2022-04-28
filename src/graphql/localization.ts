import { gql } from '@apollo/client';
import {
  GetAttributesQuery,
  LocalizationAttribute,
} from '../generated/graphql';
import { GqlQueryResult } from './types';

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

const LOCALIZED_TEXTS_MUTATION_RESPONSE = gql`
  fragment localized_texts_mutation_response on localization_localized_text_mutation_response {
    returning {
      ...localized_texts_all_fields
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
