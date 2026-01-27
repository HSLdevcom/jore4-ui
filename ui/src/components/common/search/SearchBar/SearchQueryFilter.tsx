import { ReactElement } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../i18n';
import { Column, Row } from '../../../../layoutComponents';
import {
  InputElement,
  InputLabel,
  ValidationErrorList,
} from '../../../forms/common';

const testIds = {
  searchInput: (testIdPrefix: string) => `${testIdPrefix}::searchInput`,
  searchButton: (testIdPrefix: string) => `${testIdPrefix}::searchButton`,
};

type SearchQueryFilterProps<FormState extends FieldValues> = {
  readonly fieldPath: Path<FormState>;
  readonly translationPrefix: TranslationKey;
  readonly testIdPrefix: string;
  readonly className?: string;
};

export const SearchQueryFilter = <FormState extends FieldValues>({
  className,
  fieldPath,
  translationPrefix,
  testIdPrefix,
}: SearchQueryFilterProps<FormState>): ReactElement => {
  const { t } = useTranslation();

  return (
    <Column className={className}>
      <InputLabel<FormState>
        fieldPath={fieldPath}
        translationPrefix={translationPrefix}
      />

      <Row>
        <InputElement<FormState>
          className="grow rounded-r-none border-r-0"
          fieldPath={fieldPath}
          id={`${translationPrefix}.query`}
          testId={testIds.searchInput(testIdPrefix)}
          type="search"
        />

        <button
          className="icon-search w-(--input-height) cursor-pointer rounded-r bg-tweaked-brand text-2xl text-white"
          type="submit"
          aria-label={t('search.search')}
          title={t('search.search')}
          data-testid={testIds.searchButton(testIdPrefix)}
        />
      </Row>

      <ValidationErrorList fieldPath={fieldPath} />
    </Column>
  );
};
