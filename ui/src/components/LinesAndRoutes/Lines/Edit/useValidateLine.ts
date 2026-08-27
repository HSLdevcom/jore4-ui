import { gql, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  GetLineDetailsWithRoutesByIdDocument,
  GetLineDetailsWithRoutesByIdQuery,
  GetLineDetailsWithRoutesByIdQueryVariables,
  RouteLineSetInput,
} from '../../../../generated/graphql';
import { assertRouteValidityIsInsideLineValidity } from '../../Common';

const GQL_GET_LINE_DETAILS_WITH_ROUTES_BY_ID = gql`
  query GetLineDetailsWithRoutesById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...LineAllFields
      line_routes {
        ...RouteAllFields
        infrastructure_links_along_route {
          route_id
          infrastructure_link_id
          infrastructure_link_sequence
          is_traversal_forwards
          infrastructure_link {
            infrastructure_link_id
            scheduled_stop_points_located_on_infrastructure_link {
              ...ScheduledStopPointAllFields
              scheduled_stop_point_in_journey_patterns {
                ...ScheduledStopPointInJourneyPatternAllFields
                journey_pattern {
                  journey_pattern_id
                  on_route_id
                }
              }
              other_label_instances {
                ...ScheduledStopPointDefaultFields
              }
            }
          }
        }
      }
    }
  }
`;

type ValidateParams = {
  readonly lineId: UUID;
  readonly input: RouteLineSetInput;
};

export function useValidateLine() {
  const { t } = useTranslation();
  const apollo = useApolloClient();

  const checkIsLineValidityOutsideRouteValidity = async ({
    lineId,
    input,
  }: ValidateParams) => {
    const lineResult = await apollo.query<
      GetLineDetailsWithRoutesByIdQuery,
      GetLineDetailsWithRoutesByIdQueryVariables
    >({
      query: GetLineDetailsWithRoutesByIdDocument,
      variables: { line_id: lineId },
    });

    const conflictingRoutes = lineResult.data.route_line_by_pk?.line_routes
      .filter((route) => {
        try {
          assertRouteValidityIsInsideLineValidity(t, route, {
            validity_start: input.validity_start,
            validity_end: input.validity_end,
          });
        } catch {
          return true;
        }

        return false;
      })
      .map((route) => route.label);

    if (conflictingRoutes?.length) {
      throw new Error(
        `${t(($) => $.lines.routesOutsideValidity)}: ${conflictingRoutes.join(', ')}`,
      );
    }
  };

  const validateLine = async (editParams: ValidateParams) => {
    await checkIsLineValidityOutsideRouteValidity(editParams);
  };

  return {
    validateLine,
  };
}
