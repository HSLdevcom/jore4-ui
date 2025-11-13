import { FC, useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Column } from '../../../../layoutComponents';
import { LineTypeDropdown } from '../../../forms/line/LineTypeDropdown';
import { RoutesAndLinesSearchFilters } from '../types';

type LineTypeFilterProps = {
  testId: string;
  className?: string;
};

export const LineTypeFilter: FC<LineTypeFilterProps> = ({
  testId,
  className,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext<RoutesAndLinesSearchFilters>();
  const typeOfLineDropdownId = useId();

  return (
    <Column className={twMerge('min-w-48', className)}>
      <label htmlFor={typeOfLineDropdownId}>{t('lines.typeOfLine')}</label>
      <Controller
        control={control}
        name="typeOfLine"
        render={({ field }) => (
          <LineTypeDropdown
            id={typeOfLineDropdownId}
            includeAllOption
            value={field.value}
            onChange={field.onChange}
            data-testid={testId}
          />
        )}
      />
    </Column>
  );
};
