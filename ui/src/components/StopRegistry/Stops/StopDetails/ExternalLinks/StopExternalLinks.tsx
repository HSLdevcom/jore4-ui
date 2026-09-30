import compact from 'lodash/compact';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import { showSuccessToast } from '../../../../../utils';
import { ExternalLinks } from '../../../Components/ExternalLinks/ExternalLinks';
import { ExternalLinksFormState } from '../../../Components/ExternalLinks/schema';
import { useEditStopExternalLinks } from './useEditExternalLinks';

type ExternalLinksProps = {
  readonly stop: StopWithDetails;
};

export const StopExternalLinks: FC<ExternalLinksProps> = ({ stop }) => {
  const { t } = useTranslation();

  const { saveStopPlaceExternalLinks, defaultErrorHandler } =
    useEditStopExternalLinks();

  const onSubmit = async (state: ExternalLinksFormState) => {
    try {
      await saveStopPlaceExternalLinks({ state, stop });

      showSuccessToast(t(($) => $.stops.editSuccess));
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  return (
    <ExternalLinks
      externalLinks={compact(stop.quay?.externalLinks)}
      onSubmit={onSubmit}
    />
  );
};
