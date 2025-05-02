import compact from 'lodash/compact';
import { useTranslation } from 'react-i18next';
import { ExternalLinksDetailsFragment } from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import { showSuccessToast } from '../../../../../utils';
import { ExternalLinks } from '../../../components/ExternalLinks/ExternalLinks';
import { ExternalLinksFormState } from '../../../components/ExternalLinks/schema';
import { useEditStopExternalLinks } from './useEditExternalLinks';

type ExternalLinksProps = {
  readonly stop: StopWithDetails;
};

function useExternalLinks(
  stop: StopWithDetails,
): Array<ExternalLinksDetailsFragment> {
  return compact(stop?.quay?.externalLinks ?? []);
}

export const StopExternalLinks: React.FC<ExternalLinksProps> = ({ stop }) => {
  const { t } = useTranslation();

  const externalLinks = useExternalLinks(stop);

  const { saveStopPlaceExternalLinks, defaultErrorHandler } =
    useEditStopExternalLinks();

  const onSubmit = async (state: ExternalLinksFormState) => {
    try {
      await saveStopPlaceExternalLinks({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  return <ExternalLinks externalLinks={externalLinks} onSubmit={onSubmit} />;
};
