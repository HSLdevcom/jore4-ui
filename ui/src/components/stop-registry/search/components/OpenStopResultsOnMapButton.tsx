import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twJoin } from 'tailwind-merge';
import { theme } from '../../../../generated/theme';
import { SimpleButton } from '../../../../uiComponents';
import {
  OpenStopResultsOnMapParams,
  useOpenStopResultsOnMap,
} from './useOpenStopResultsOnMap';

const testIds = {
  showOnMapButton: 'StopSearchResultsPage::showOnMapButton',
  showOnMapButtonLoading: 'StopSearchResultsPage::showOnMapButton::loading',
};

type OpenStopResultsOnMapButtonProps = {
  readonly className?: string;
  readonly hasResults: boolean;
} & OpenStopResultsOnMapParams;

export const OpenStopResultsOnMapButton: FC<
  OpenStopResultsOnMapButtonProps
> = ({ className, hasResults, ...openOnMapParams }) => {
  const { t } = useTranslation();

  const nothingSelected =
    openOnMapParams.resultSelection.selectionState === 'NONE_SELECTED';

  const [transitioning, transitionToMap] =
    useOpenStopResultsOnMap(openOnMapParams);

  if (!hasResults) {
    return null;
  }

  return (
    <SimpleButton
      className={twJoin(
        'px-3 py-1 text-sm leading-none disabled:cursor-wait',
        className,
      )}
      disabled={nothingSelected || transitioning}
      onClick={transitionToMap}
      type="button"
      testId={testIds.showOnMapButton}
    >
      {transitioning ? (
        <PulseLoader
          color={theme.colors.brand}
          cssOverride={{ margin: '-2px' }}
          data-testid={testIds.showOnMapButtonLoading}
          size={14}
        />
      ) : (
        t('stopRegistrySearch.showOnMap')
      )}
    </SimpleButton>
  );
};
