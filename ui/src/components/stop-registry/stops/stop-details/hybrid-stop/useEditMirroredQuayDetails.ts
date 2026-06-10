import { useTranslation } from 'react-i18next';
import {
  StopRegistryStopPlaceInput,
  useUpdateStopPlaceMutation,
} from '../../../../../generated/graphql';
import { EnrichedQuay, EnrichedStopPlace } from '../../../../../types';
import {
  KnownValueKey,
  patchKeyValues,
  showDangerToastWithError,
} from '../../../../../utils';
import { MirroredQuayFormState } from './mirrored-quay-form/schema';

type SaveMirroredQuayParams = {
  readonly state: MirroredQuayFormState;
  readonly quay: EnrichedQuay;
  readonly stopPlace: EnrichedStopPlace;
};

export function useEditMirroredQuayDetails() {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const buildMutationInput = ({
    state,
    quay,
    stopPlace,
  }: SaveMirroredQuayParams): StopRegistryStopPlaceInput => {
    const quayId = quay.id;

    return {
      id: stopPlace.id,
      quays: [
        {
          id: quayId,
          keyValues: patchKeyValues(quay, [
            {
              key: KnownValueKey.StopState,
              values: state.stopState ? [state.stopState] : [],
            },
          ]),
          versionComment: state.reasonForChange,
        },
      ],
    };
  };

  const saveMirroredQuayDetails = async (params: SaveMirroredQuayParams) => {
    const input = buildMutationInput(params);
    await updateStopPlaceMutation({
      variables: { input },
      refetchQueries: [
        'GetStopDetails',
        'GetLatestQuayChange',
        'GetStopChangeHistory',
      ],
    });
  };

  const defaultErrorHandler = (err: Error) => {
    showDangerToastWithError(`${t(($) => $.errors.saveFailed)}`, err);
  };

  return { saveMirroredQuayDetails, defaultErrorHandler };
}
