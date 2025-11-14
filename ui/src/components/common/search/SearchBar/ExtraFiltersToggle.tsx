import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ExpandButton } from '../../../../uiComponents';

const testIds = {
  toggleExpand: (prefix: string) => `${prefix}::chevronToggle`,
};

type ExtraFiltersToggleProps = {
  readonly className?: string;
  readonly extraFiltersId: string;
  readonly searchIsExpanded: boolean;
  readonly toggleSearchIsExpanded: () => void;
  readonly testIdPrefix: string;
};

export const ExtraFiltersToggle: FC<ExtraFiltersToggleProps> = ({
  className,
  extraFiltersId,
  searchIsExpanded,
  toggleSearchIsExpanded,
  testIdPrefix,
}) => {
  const { t } = useTranslation();

  return (
    <ExpandButton
      ariaControls={extraFiltersId}
      className={twMerge(
        'flex h-[--input-height] w-[--input-height] items-center justify-center rounded bg-tweaked-brand',
        className,
      )}
      iconClassName="text-white"
      expanded={searchIsExpanded}
      expandedText=""
      onClick={toggleSearchIsExpanded}
      testId={testIds.toggleExpand(testIdPrefix)}
      title={
        searchIsExpanded
          ? t('accessibility:common.closeSearch')
          : t('accessibility:common.expandSearch')
      }
    />
  );
};
