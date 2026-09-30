import compact from 'lodash/compact';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { showSuccessToast } from '../../../../../../utils';
import { ExternalLinks } from '../../../../Components/ExternalLinks/ExternalLinks';
import { ExternalLinksFormState } from '../../../../Components/ExternalLinks/schema';
import { useEditTerminalExternalLinks } from './useEditTerminalExternalLinks';

type ExternalLinksProps = {
  readonly terminal: EnrichedParentStopPlace;
};

export const TerminalExternalLinks: FC<ExternalLinksProps> = ({ terminal }) => {
  const { t } = useTranslation();

  const { saveParentStopPlaceExternalLinks, defaultErrorHandler } =
    useEditTerminalExternalLinks();

  const onSubmit = async (state: ExternalLinksFormState) => {
    try {
      await saveParentStopPlaceExternalLinks({ state, terminal });

      showSuccessToast(t(($) => $.terminalDetails.editSuccess));
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  return (
    <ExternalLinks
      externalLinks={compact(terminal.externalLinks)}
      onSubmit={onSubmit}
    />
  );
};
