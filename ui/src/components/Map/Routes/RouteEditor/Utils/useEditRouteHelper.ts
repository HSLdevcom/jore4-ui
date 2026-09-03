import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Operation,
  selectEditedRouteData,
  stopRouteEditingAction,
  useAppDispatch,
  useAppSelector,
  useLoader,
} from '../../../../../redux';
import { showSuccessToast } from '../../../../../utils';
import { hasBlockers } from '../../../../LinesAndRoutes/Common/SaveBlockers';
import { useDefaultErrorHandler } from './useDefaultErrorHandler';
import { EditChanges, useEditRouteGeometry } from './useEditRouteGeometry';

export function useEditRouteHelper() {
  const { t } = useTranslation();
  const defaultErrorHandler = useDefaultErrorHandler();
  const dispatch = useAppDispatch();

  const {
    id,
    infraLinks,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPattern,
    metaData: routeDetails,
    lineInfo,
  } = useAppSelector(selectEditedRouteData);

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  const [pendingChanges, setPendingChanges] = useState<EditChanges | null>(
    null,
  );

  const { prepareEditGeometry, editRouteGeometryMutation } =
    useEditRouteGeometry();

  const onCommitEditChanges = async (changes: EditChanges) => {
    await editRouteGeometryMutation(changes);

    showSuccessToast(t(($) => $.routes.saveSuccess));
    dispatch(stopRouteEditingAction());
  };

  const onDoEdit = async () => {
    if (!infraLinks || !journeyPattern.id || !routeDetails || !lineInfo) {
      const fields = JSON.stringify(
        {
          infraLinks,
          'journeyPattern.id': journeyPattern.id,
          routeDetails,
          lineInfo,
        },
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (v) => (v === undefined ? '!!undefined¡¡' : v),
        0,
      );
      throw new Error(
        `Illegal state! Expected all fields (${fields}) to be valid!`,
      );
    }

    try {
      const changes = await prepareEditGeometry({
        routeId: id ?? '',
        stopsEligibleForJourneyPattern,
        includedStopLabels,
        journeyPatternStops: journeyPattern.stops,
        infraLinksAlongRoute: infraLinks,
        journeyPatternId: journeyPattern.id,
        routePriority: routeDetails.priority,
        lineType: lineInfo.type_of_line,
      });

      if (hasBlockers(changes)) {
        setPendingChanges(changes);
      } else {
        await onCommitEditChanges(changes);
      }
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingEditChanges: pendingChanges,
    onCancelEdit: () => setPendingChanges(null),
    onConfirmEdit: pendingChanges
      ? () => {
          setIsLoading(true);
          setPendingChanges(null);

          return onCommitEditChanges(pendingChanges).finally(() =>
            setIsLoading(false),
          );
        }
      : null,
    onDoEdit,
  };
}
