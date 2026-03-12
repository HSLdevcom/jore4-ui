import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRemoveFromMultiModalStopPlaceMutation } from '../../../../../generated/graphql';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../../utils';

export const useRemoveStopAreaFromTerminal = () => {
  const { t } = useTranslation();
  const [removeFromMultiModalStopPlace] =
    useRemoveFromMultiModalStopPlaceMutation();

  const removeStopAreaFromTerminal = useCallback(
    async (terminalId: string, stopAreaId: string) => {
      try {
        await removeFromMultiModalStopPlace({
          variables: {
            parentSiteRef: terminalId,
            stopPlaceId: [stopAreaId],
          },
          awaitRefetchQueries: true,
          refetchQueries: ['getParentStopPlaceDetails'],
        });
        showSuccessToast(t('terminalDetails.stops.editSuccess'));
      } catch (err) {
        showDangerToastWithError(
          t('terminalDetails.errors.editMemberStops'),
          err,
        );
      }
    },
    [removeFromMultiModalStopPlace, t],
  );

  return { removeStopAreaFromTerminal };
};
