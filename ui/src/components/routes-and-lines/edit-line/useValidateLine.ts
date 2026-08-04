import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  RouteLineSetInput,
  useGetLineDetailsWithRoutesByIdLazyQuery,
} from '../../../generated/graphql';
import { useValidateRoute } from '../../map/routes/hooks/useValidateRoute';

const GQL_GET_LINE_DETAILS_WITH_ROUTES_BY_ID = gql`
  query GetLineDetailsWithRoutesById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_all_fields
      line_routes {
        ...route_all_fields
        infrastructure_links_along_route {
          route_id
          infrastructure_link_id
          infrastructure_link_sequence
          is_traversal_forwards
          infrastructure_link {
            infrastructure_link_id
            scheduled_stop_points_located_on_infrastructure_link {
              ...scheduled_stop_point_all_fields
              scheduled_stop_point_in_journey_patterns {
                ...scheduled_stop_point_in_journey_pattern_all_fields
                journey_pattern {
                  journey_pattern_id
                  on_route_id
                }
              }
              other_label_instances {
                ...scheduled_stop_point_default_fields
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

export const useValidateLine = () => {
  const { t } = useTranslation();

  const { checkIsRouteValidityInsideLineValidity } = useValidateRoute();

  const [getLineWithRoutesById] = useGetLineDetailsWithRoutesByIdLazyQuery();

  const checkIsLineValidityOutsideRouteValidity = async ({
    lineId,
    input,
  }: ValidateParams) => {
    const lineResult = await getLineWithRoutesById({
      variables: { line_id: lineId },
    });
    const line = lineResult.data?.route_line_by_pk;

    const routes = line?.line_routes;
    const conflictingRoutes: string[] = [];

    routes?.forEach((route) => {
      try {
        checkIsRouteValidityInsideLineValidity(route, {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          validity_start: input.validity_start!,
          validity_end: input.validity_end,
        });
      } catch {
        conflictingRoutes.push(route.label);
      }
    });

    if (conflictingRoutes.length) {
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
};
