import compact from 'lodash/compact';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TerminalExternalLinksDetailsFragment } from '../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../types';
import { showSuccessToast } from '../../../../../utils';
import { ExternalLinks } from '../../../components/ExternalLinks/ExternalLinks';
import { ExternalLinksFormState } from '../../../components/ExternalLinks/schema';
import { useEditTerminalExternalLinks } from './useEditTerminalExternalLinks';

type ExternalLinksProps = {
  readonly terminal: EnrichedParentStopPlace;
};

function useExternalLinks(
  terminal: EnrichedParentStopPlace,
): Array<TerminalExternalLinksDetailsFragment> {
  return compact(terminal?.externalLinks);
}

export const TerminalExternalLinks: FC<ExternalLinksProps> = ({ terminal }) => {
  const { t } = useTranslation();

  const externalLinks = useExternalLinks(terminal);

  const { saveParentStopPlaceExternalLinks, defaultErrorHandler } =
    useEditTerminalExternalLinks();

  const onSubmit = async (state: ExternalLinksFormState) => {
    try {
      await saveParentStopPlaceExternalLinks({ state, terminal });

      showSuccessToast(t('stops.editSuccess'));
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  return <ExternalLinks externalLinks={externalLinks} onSubmit={onSubmit} />;
};
