import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../Buttons';
import { Row } from '../LayoutComponents';

const testIds = {
  searchButton: (prefix: string) => `${prefix}::expandedSearchButton`,
};

type ExpandedSearchButtonsProps = {
  readonly testIdPrefix: string;
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
}) => {
  const { t } = useTranslation();

  return (
    <Row className="justify-end gap-4 bg-background px-10 py-4">
      <SimpleButton
        className="w-32"
        type={searchButtonType}
        onClick={searchButtonType === 'button' ? onSearch : undefined}
        testId={testIds.searchButton(testIdPrefix)}
      >
        {t(($) => $.search.search)}
      </SimpleButton>
    </Row>
  );
};
