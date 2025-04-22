import { Transition } from '@headlessui/react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ExpandButton } from '../../../uiComponents';
import { FormRow, InputField } from '../../forms/common';
import { StopAreaFormState } from '../../forms/stop-area';
import { accordionClassNames } from '../../stop-registry/stops/versions/utils';

const ID = 'StopAreaNameSection';
const HeaderId = 'StopAreaNameSection::Header';

const testIds = {
  showHideButton: 'StopAreaFormComponent::showHideButton',
  nameSwe: 'StopAreaFormComponent::nameSwe',
  nameLongFin: 'StopAreaFormComponent::nameLongFin',
  nameLongSwe: 'StopAreaFormComponent::nameLongSwe',
  abbreviationFin: 'StopAreaFormComponent::abbreviationFin',
  abbreviationSwe: 'StopAreaFormComponent::abbreviationSwe',
  errorIndicator: 'StopAreaFormComponent::errorIndicator',
};

export const StopAreaNames: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const {
    formState: { errors },
  } = useFormContext<StopAreaFormState>();

  // Check if there are any errors in the fields that are hidden when collapsed
  const hasHiddenErrors =
    errors.nameSwe ??
    errors.nameLongFin ??
    errors.nameLongSwe ??
    errors.abbreviationFin ??
    errors.abbreviationSwe;

  return (
    <>
      <div className="flex items-center">
        {!expanded && hasHiddenErrors && (
          <div
            className="mr-2 w-1/2 text-hsl-red"
            data-testid={testIds.errorIndicator}
          >
            <span>{t('stopArea.errors.expandToSeeErrors')}</span>
          </div>
        )}
        <ExpandButton
          className="ml-auto"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t('stops.stopArea.showDetails')}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
          iconClassName="text-base"
        />
      </div>
      <Transition
        className="mt-2 flex flex-row flex-wrap gap-8 py-2"
        id={ID}
        role="region"
        show={expanded}
        aria-hidden={!expanded}
        aria-labelledby={HeaderId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accordionClassNames}
      >
        <FormRow mdColumns={1}>
          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopArea"
            fieldPath="nameSwe"
            testId={testIds.nameSwe}
          />
        </FormRow>
        <FormRow mdColumns={2}>
          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="nameLongFin"
            testId={testIds.nameLongFin}
          />
          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="nameLongSwe"
            testId={testIds.nameLongSwe}
          />
          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="abbreviationFin"
            testId={testIds.abbreviationFin}
          />
          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="abbreviationSwe"
            testId={testIds.abbreviationSwe}
          />
        </FormRow>
      </Transition>
    </>
  );
};
