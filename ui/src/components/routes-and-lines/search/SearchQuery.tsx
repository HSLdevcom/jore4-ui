import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';
import { SearchInput } from '../../common';

const testIds = {
  searchInput: 'SearchContainer::searchInput',
  toggleExpand: 'SearchContainer::chevronToggle',
};

type SearchQueryProps = {
  readonly className?: string;
  readonly onChangeLabel: (value: string) => void;
  readonly onSearch: () => void;
  readonly searchConditions: {
    readonly label: string;
  };
};

export const SearchQuery: FC<SearchQueryProps> = ({
  className,
  onChangeLabel,
  onSearch,
  searchConditions,
}) => {
  const { t } = useTranslation();

  return (
    <Column className={className}>
      <Row>
        <label htmlFor="label">{t('search.searchLabel')}</label>
      </Row>
      <Row>
        <SearchInput
          className="flex-1 rounded-r-none border-r-0"
          testId={testIds.searchInput}
          value={searchConditions.label}
          onSearch={onSearch}
          onChange={onChangeLabel}
        />

        <button
          className="icon-search w-[--input-height] rounded-r bg-tweaked-brand text-2xl text-white"
          aria-label={t('search.search')}
          title={t('search.search')}
          type="button"
          onClick={onSearch}
        />
      </Row>
    </Column>
  );
};
