import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../../layoutComponents';
import { SearchConditionToggle } from './SearchConditionsToggle';
import { SearchInput } from './SearchInput';

export const SearchBarContainer = ({
  isToggled,
  value,
  onToggle,
  onChange,
  onSearch,
}: {
  isToggled: boolean;
  value: string;
  onToggle: () => void;
  onChange: (propertyName: string, value: string) => void;
  onSearch: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Row className="justify-center bg-background py-4">
      <Column className=" w-2/4">
        <Row>
          <label htmlFor="label">{t('search.searchLabel')}</label>
        </Row>
        <Row className="space-x-4">
          <SearchInput
            value={value}
            onSearch={onSearch}
            onChange={(val) => onChange('label', val)}
          />
          <SearchConditionToggle isToggled={isToggled} onClick={onToggle} />
        </Row>
      </Column>
    </Row>
  );
};
