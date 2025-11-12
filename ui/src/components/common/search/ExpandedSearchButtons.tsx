import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';

const testIds = {
  hideButton: (prefix: string) => `${prefix}::hideButton`,
  searchButton: (prefix: string) => `${prefix}::searchButton`,
};

type ExpandedSearchButtonsProps = {
  readonly testIdPrefix: string;
  readonly toggleExpand: () => void;
} & (
  | {
      readonly searchButtonType: 'button';
      readonly onSearch: () => void;
    }
  | {
      readonly searchButtonType: 'submit';
      readonly onSearch?: never;
    }
);

export const ExpandedSearchButtons: FC<ExpandedSearchButtonsProps> = ({
  testIdPrefix,
  searchButtonType,
  onSearch,
  toggleExpand,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="flex justify-end bg-background py-4">
      <SimpleButton
        containerClassName="mr-4"
        className="h-12 w-32"
        inverted
        testId={testIds.hideButton(testIdPrefix)}
        onClick={toggleExpand}
      >
        {t('hide')}
      </SimpleButton>
      <SimpleButton
        containerClassName="mr-6"
        className="h-12 w-32"
        type={searchButtonType}
        onClick={searchButtonType === 'button' ? onSearch : undefined}
        testId={testIds.searchButton(testIdPrefix)}
      >
        {t('search.search')}
      </SimpleButton>
    </Row>
  );
};
