import { useTranslation } from 'react-i18next';
import {
  RouteLineSetInput,
  useGetLineDetailsWithRoutesByIdAsyncQuery,
} from '../../generated/graphql';
import { mapLineDetailsWithRoutesResult } from '../../graphql';
import { useValidateRoute } from '../routes';

interface ValidateParams {
  lineId: UUID;
  input: RouteLineSetInput;
}

export const useValidateLine = () => {
  const { t } = useTranslation();

  const { checkIsRouteValidityInsideLineValidity } = useValidateRoute();

  const [getLineWithRoutesById] = useGetLineDetailsWithRoutesByIdAsyncQuery();

  const checkIsLineValidityOutsideRouteValidity = async ({
    lineId,
    input,
  }: ValidateParams) => {
    const lineResult = await getLineWithRoutesById({ line_id: lineId });
    const line = mapLineDetailsWithRoutesResult(lineResult);

    const routes = line?.line_routes;
    const conflictingRoutes: string[] = [];

    routes?.forEach((route) => {
      try {
        checkIsRouteValidityInsideLineValidity(route, {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          validity_start: input.validity_start!,
          validity_end: input.validity_end,
        });
      } catch (error) {
        conflictingRoutes.push(route.label);
      }
    });

    if (conflictingRoutes.length) {
      throw new Error(
        `${t('lines.routesOutsideValidity')}: ${conflictingRoutes.join(', ')}`,
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
