import { useTranslation } from 'react-i18next';
import {
  StopRegistryParentStopPlaceInput,
  useUpdateTerminalMutation,
} from '../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../types';
import { showDangerToastWithError } from '../../../../../utils';
import {
  ExternalLinksFormState,
  ExternalLinksState,
} from '../../../components/ExternalLinks/schema';

type EditTiamatParams = {
  readonly state: ExternalLinksFormState;
  readonly terminal: EnrichedParentStopPlace;
};

const mapExternalLinkFormToInput = (externalLink: ExternalLinksState) => {
  return {
    name: externalLink.name,
    location: externalLink.location,
  };
};

function mapTerminalEditChangesToTiamatDbInput({
  state,
  terminal,
}: EditTiamatParams): StopRegistryParentStopPlaceInput {
  const stopPlaceId = terminal.id;

  const externalLinksInput = state.externalLinks
    .filter((s) => !s.toBeDeleted)
    .map(mapExternalLinkFormToInput);

  return {
    id: stopPlaceId,
    externalLinks: externalLinksInput.length ? externalLinksInput : [null],
  };
}

function prepareEditForTiamatDb({ state, terminal }: EditTiamatParams) {
  return {
    input: mapTerminalEditChangesToTiamatDbInput({
      state,
      terminal,
    }),
  };
}

export const useEditTerminalExternalLinks = () => {
  const { t } = useTranslation();
  const [updateTerminalMutation] = useUpdateTerminalMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['getParentStopPlaceDetails'],
  });

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateTerminalMutation({
      variables: changesToTiamatDb,
    });
  };

  const saveParentStopPlaceExternalLinks = async ({
    state,
    terminal,
  }: {
    state: ExternalLinksFormState;
    terminal: EnrichedParentStopPlace;
  }) => {
    await updateTiamatStopPlace({
      state,
      terminal,
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    saveParentStopPlaceExternalLinks,
    defaultErrorHandler,
  };
};
