import { useTranslation } from 'react-i18next';
import {
  StopRegistryStopPlaceInput,
  useUpdateStopPlaceMutation,
} from '../../../../../generated/graphql';
import { getQuayIdsFromStopExcept } from '../../../../../hooks';
import { StopWithDetails } from '../../../../../types';
import { showDangerToast } from '../../../../../utils';
import {
  ExternalLinksFormState,
  ExternalLinksState,
} from '../../../components/ExternalLinks/schema';

type EditTiamatParams = {
  readonly state: ExternalLinksFormState;
  readonly stop: StopWithDetails;
};

const mapExternalLinkFormToInput = (externalLink: ExternalLinksState) => {
  return {
    name: externalLink.name,
    location: externalLink.location,
  };
};

function mapStopEditChangesToTiamatDbInput({
  state,
  stop,
}: EditTiamatParams): StopRegistryStopPlaceInput {
  const stopPlaceId = stop.stop_place?.id;
  const stopPlaceQuayId = stop.stop_place_ref;
  const otherQuays = getQuayIdsFromStopExcept(stop, stopPlaceQuayId);

  const externalLinksInput = state.externalLinks
    .filter((s) => !s.toBeDeleted)
    .map(mapExternalLinkFormToInput);

  return {
    id: stopPlaceId,
    quays: [
      ...otherQuays,
      {
        id: stopPlaceQuayId,
        externalLinks: externalLinksInput.length ? externalLinksInput : [null],
      },
    ],
  };
}

function prepareEditForTiamatDb({ state, stop }: EditTiamatParams) {
  return {
    input: mapStopEditChangesToTiamatDbInput({
      state,
      stop,
    }),
  };
}

export const useEditStopExternalLinks = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateStopPlaceMutation({
      variables: changesToTiamatDb,
    });
  };

  const saveStopPlaceExternalLinks = async ({
    state,
    stop,
  }: {
    state: ExternalLinksFormState;
    stop: StopWithDetails;
  }) => {
    await updateTiamatStopPlace({
      state,
      stop,
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t('errors.saveFailed')}, ${err}`);
  };

  return {
    saveStopPlaceExternalLinks,
    defaultErrorHandler,
  };
};
