import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../../../../layoutComponents';
import {
  InputElement,
  InputLabel,
  ValidationErrorList,
} from '../../../../../forms/common';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { ClassNameProps } from '../Types/ClassNameProps';

export const SearchQueryFilter: FC<ClassNameProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="query"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <Row>
        <InputElement<StopSearchFilters>
          className="flex-grow rounded-r-none border-r-0"
          fieldPath="query"
          id="stopRegistrySearch.fieldLabels.query"
          testId={stopSearchBarTestIds.searchInput}
          type="search"
        />

        <button
          className="icon-search w-[--input-height] rounded-r bg-tweaked-brand text-2xl text-white"
          type="submit"
          aria-label={t('search.search')}
          title={t('search.search')}
        />
      </Row>

      <ValidationErrorList fieldPath="query" />
    </Column>
  );
};
