import { gql } from 'graphql-tag';
import { getGqlString } from '../builders/mutations/utils';
import { GetInfrastructureLinksByExternalIdsResult } from '../types';

const GQL_GET_INFRASTRUCTURE_LINKS_BY_EXTERNAL_IDS = gql`
  query GetInfrastructureLinksByExternalIds($external_ids: [String!]) {
    infrastructure_network_infrastructure_link(
      where: { external_link_id: { _in: $external_ids } }
    ) {
      infrastructure_link_id
      external_link_id
    }
  }
`;

export const mapToGetInfrastructureLinksByExternalIdsQuery = (
  externalIds: string[],
) => {
  return {
    query: getGqlString(GQL_GET_INFRASTRUCTURE_LINKS_BY_EXTERNAL_IDS),
    variables: { external_ids: externalIds },
  };
};

export const extractInfrastructureLinkIdsFromResponse = (
  res: GetInfrastructureLinksByExternalIdsResult,
): UUID[] =>
  res.data.infrastructure_network_infrastructure_link.map(
    (link) => link.infrastructure_link_id,
  );
