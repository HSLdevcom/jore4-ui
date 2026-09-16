import { ApolloClient } from '@apollo/client';
import { GetResourceResponse, RequestParameters } from 'maplibre-gl';

export type ApolloQueryHandler<Response> = (
  apollo: ApolloClient,
  params: URLSearchParams,
  requestParameters: RequestParameters,
  abortController: AbortController,
) => Promise<GetResourceResponse<Response>>;
