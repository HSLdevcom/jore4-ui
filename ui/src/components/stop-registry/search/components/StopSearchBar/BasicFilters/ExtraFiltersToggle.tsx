import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronToggle } from '../../../../../../uiComponents';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';

type ExtraFiltersToggleProps = {
  readonly className?: string;
  readonly extraFiltersId: string;
  readonly searchIsExpanded: boolean;
  readonly toggleSearchIsExpanded: () => void;
};

export const ExtraFiltersToggle: FC<ExtraFiltersToggleProps> = ({
  className,
  extraFiltersId,
  searchIsExpanded,
  toggleSearchIsExpanded,
}) => {
  const { t } = useTranslation();

  return (
    <ChevronToggle
      className={className}
      testId={stopSearchBarTestIds.toggleExpand}
      isToggled={searchIsExpanded}
      onClick={toggleSearchIsExpanded}
      controls={extraFiltersId}
      openTooltip={t('accessibility:common.expandSearch')}
      closeTooltip={t('accessibility:common.closeSearch')}
    />
  );
};
