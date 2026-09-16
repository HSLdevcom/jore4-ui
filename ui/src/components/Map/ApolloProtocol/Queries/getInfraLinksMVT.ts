import { ApolloClient, gql } from '@apollo/client';
import { RequestParameters } from 'maplibre-gl';
import {
  GetInfraLinksMvtDocument,
  GetInfraLinksMvtQuery,
  GetInfraLinksMvtQueryVariables,
  ReusableComponentsVehicleSubmodeEnum,
} from '../../../../generated/graphql';
import { apolloHost, apolloPath, apolloProtocol } from '../consts';
import { ApolloAbortedError, ApolloExecutionError } from '../errors';
import { getIntArg, getStringArg } from '../helpers';

const GQL_GET_INFRA_LINKS_MVT = gql`
  query GetInfraLinksMVT($args: getLinkMVT_arguments!) {
    getLinkMVT(args: $args) {
      id
      data
    }
  }
`;

export async function getInfraLinksMVT(
  apollo: ApolloClient,
  params: URLSearchParams,
  requestParameters: RequestParameters,
  abortController: AbortController,
) {
  const variables: GetInfraLinksMvtQueryVariables = {
    args: {
      vehicle_submode: getStringArg(params, 'vehicle_submode'),
      z: getIntArg(params, 'z'),
      x: getIntArg(params, 'x'),
      y: getIntArg(params, 'y'),
    },
  };

  const result = await apollo.query<
    GetInfraLinksMvtQuery,
    GetInfraLinksMvtQueryVariables
  >({ query: GetInfraLinksMvtDocument, variables, fetchPolicy: 'no-cache' });

  if (abortController.signal.aborted) {
    throw new ApolloAbortedError(abortController.signal);
  }

  if (result.error) {
    throw new ApolloExecutionError('GetInfraLinksMVT', variables, result.error);
  }

  const data = Uint8Array.fromBase64(result.data.getLinkMVT.at(0)?.data ?? '');

  return { data: data.buffer };
}

export function getInfraLinksMVTUrl(
  submode: ReusableComponentsVehicleSubmodeEnum,
) {
  return `${apolloProtocol}://${apolloHost}${apolloPath}?query=GetInfraLinksMVT&vehicle_submode=${submode}&z={z}&x={x}&y={y}`;
}
