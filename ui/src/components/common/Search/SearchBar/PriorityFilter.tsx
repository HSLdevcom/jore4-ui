import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import without from 'lodash/without';
import { ReactElement } from 'react';
import { FieldValues, Path, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { TranslationKey } from '../../../../i18n';
import { Priority, temporaryPriorities } from '../../../../types/enums';
import { mapPriorityToUiName } from '../../../../utils/i18n';
import { splitDropdownStyles } from '../../Dropdowns';
import { InputLabel, LabeledCheckbox } from '../../Inputs';
import { Column, Row } from '../../LayoutComponents';
import { temporaryLevelBadges } from '../../PrioritySymbol';

const testIds = {
  priorityCheckbox: (prefix: string, priority: Priority) =>
    `${prefix}::priority::${Priority[priority]}`,
  temporaryDropdown: (prefix: string) => `${prefix}::temporaryPriorityDropdown`,
};

const temporaryLevels = without(temporaryPriorities, Priority.Temporary);

type PriorityFilterProps<FormState extends FieldValues> = {
  readonly fieldPath: Path<FormState>;
  readonly testIdPrefix: string;
  readonly translationPrefix: TranslationKey;
  readonly className?: string;
  readonly disabled?: boolean;
};

export const PriorityFilter = <FormState extends FieldValues>({
  fieldPath,
  testIdPrefix,
  translationPrefix,
  className,
  disabled,
}: PriorityFilterProps<FormState>): ReactElement => {
  const { t } = useTranslation();

  const {
    field: { onChange, value, disabled: controllerDisabled, onBlur, ref },
  } = useController<FormState, typeof fieldPath>({
    name: fieldPath,
  });

  const togglePriority = (priority: Priority) => () => {
    if (value.includes(priority)) {
      onChange(without(value, priority).toSorted());
    } else {
      onChange(value.concat(priority).toSorted());
    }
  };

  const isDisabled = !!controllerDisabled || disabled;
  const selectedLevelCount = temporaryLevels.filter((priority) =>
    value.includes(priority),
  ).length;

  const renderCheckbox = (priority: Priority, checkboxClassName: string) => (
    <LabeledCheckbox
      key={priority}
      className={checkboxClassName}
      label={mapPriorityToUiName(t, priority)}
      onBlur={onBlur}
      onClick={togglePriority(priority)}
      disabled={isDisabled}
      selected={value.includes(priority)}
      testId={testIds.priorityCheckbox(testIdPrefix, priority)}
      ref={priority === Priority.Standard ? ref : undefined}
    />
  );

  return (
    <Column className={className}>
      <InputLabel
        fieldPath="priorities"
        translationPrefix={translationPrefix}
      />
      <Row className="gap-2">
        {renderCheckbox(Priority.Standard, 'h-(--input-height)')}
        <Popover className="relative flex">
          {renderCheckbox(
            Priority.Temporary,
            'h-(--input-height) rounded-r-none border-r-0',
          )}
          <PopoverButton
            disabled={isDisabled}
            className={splitDropdownStyles.button(selectedLevelCount > 0)}
            data-testid={`${testIds.temporaryDropdown(testIdPrefix)}::button`}
            aria-label={mapPriorityToUiName(t, Priority.Temporary)}
          >
            {selectedLevelCount > 0 && <span>{selectedLevelCount}</span>}
            <i aria-hidden className="icon-arrow text-[10px]" />
          </PopoverButton>
          <PopoverPanel
            className={splitDropdownStyles.options}
            data-testid={`${testIds.temporaryDropdown(testIdPrefix)}::options`}
          >
            {temporaryLevels.map((level) =>
              renderCheckbox(
                level,
                twJoin('text-tweaked-brand', temporaryLevelBadges[level]?.bg),
              ),
            )}
          </PopoverPanel>
        </Popover>
        {renderCheckbox(Priority.Draft, 'h-(--input-height)')}
      </Row>
    </Column>
  );
};
