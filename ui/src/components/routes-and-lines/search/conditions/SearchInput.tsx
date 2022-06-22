import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export const SearchInput = ({
  value,
  onChange,
  onSearch,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  return (
    <input
      className="flex-1"
      type="text"
      value={value}
      placeholder={t('search.searchPlaceholder')}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
  );
};
