import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Visible } from '../../../../../../layoutComponents';
import { ExpandedSearchButtons } from '../../../../../common';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { StopPropertyFilters } from './StopPropertyFilters';

type ExtraFiltersProps = {
  readonly className?: string;
  readonly id: string;
  readonly notForStops: boolean;
  readonly searchIsExpanded: boolean;
  readonly toggleExpanded: () => void;
};

export const ExtraFilters: FC<ExtraFiltersProps> = ({
  className,
  id,
  notForStops,
  searchIsExpanded,
  toggleExpanded,
}) => {
  const { t } = useTranslation();

  return (
    <Visible visible={searchIsExpanded}>
      <div
        id={id}
        className={twMerge(
          'space-y-5 border-2 border-background p-8',
          className,
        )}
      >
        <h2>{t('search.advancedSearchTitle')}</h2>

        <StopPropertyFilters
          className="border-b border-background pb-5 xl:w-2/3 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-5"
          notForStops={notForStops}
        />

        {/* Future extended filters: Nousijamäärä, Päivitystiedot, ... */}
        {/* <MetaFilters className="xl:w-1/3 xl:pt-5 xl:pl-5 pt-5  space-y-5" */}
      </div>

      <ExpandedSearchButtons
        testIdPrefix={stopSearchBarTestIds.prefix}
        searchButtonType="submit"
        toggleExpand={toggleExpanded}
        onSearch={undefined}
      />
    </Visible>
  );
};
