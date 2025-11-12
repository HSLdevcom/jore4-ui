import { FC, KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type SearchInputProps = {
  readonly className?: string;
  readonly value?: string;
  readonly onChange: (value: string) => void;
  readonly onSearch: () => void;
  readonly testId?: string;
};

export const SearchInput: FC<SearchInputProps> = ({
  className,
  value,
  onChange,
  onSearch,
  testId,
}) => {
  const { t } = useTranslation();
  const onKeyPress: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  return (
    <input
      data-testid={testId}
      className={className}
      type="text"
      value={value}
      placeholder={t('search.searchPlaceholder')}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyPress}
    />
  );
};
