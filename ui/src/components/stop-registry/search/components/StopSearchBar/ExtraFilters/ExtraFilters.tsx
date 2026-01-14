import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row, Visible } from '../../../../../../layoutComponents';
import { ExpandedSearchButtons } from '../../../../../common';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { MetaFilters } from './MetaFilters';
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

        <Row className="flex flex-wrap xl:flex-nowrap">
          <StopPropertyFilters
            className="border-b border-background pb-5 xl:w-2/3 xl:border-r xl:border-b-0 xl:pr-5 xl:pb-0"
            notForStops={notForStops}
          />

          <MetaFilters
            className="sm:w-full xl:w-1/3"
            notForStops={notForStops}
          />
        </Row>
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
