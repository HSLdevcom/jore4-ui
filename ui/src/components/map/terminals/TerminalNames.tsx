import { Transition } from '@headlessui/react';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ExpandButton } from '../../../uiComponents';
import { FormRow, InputField } from '../../forms/common';
import { accordionClassNames } from '../../stop-registry/stops/versions/utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';

const ID = 'TerminalNameSection';
const HeaderId = 'TerminalNameSection::Header';

const testIds = {
  showHideButton: 'TerminalFormComponent::showHideButton',
  nameSwe: 'TerminalFormComponent::nameSwe',
  nameLongFin: 'TerminalFormComponent::nameLongFin',
  nameLongSwe: 'TerminalFormComponent::nameLongSwe',
  abbreviationFin: 'TerminalFormComponent::abbreviationFin',
  abbreviationSwe: 'TerminalFormComponent::abbreviationSwe',
  nameEng: 'TerminalFormComponent::nameEng',
  nameLongEng: 'TerminalFormComponent::nameLongEng',
  abbreviationEng: 'TerminalFormComponent::abbreviationEng',
  errorIndicator: 'TerminalFormComponent::errorIndicator',
};

export const TerminalNames: FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const {
    formState: { errors },
  } = useFormContext<TerminalFormState>();

  // Check if there are any errors in the fields that are hidden when collapsed
  const hasHiddenErrors =
    errors.nameSwe ??
    errors.nameLongFin ??
    errors.nameLongSwe ??
    errors.abbreviationFin ??
    errors.abbreviationSwe ??
    errors.nameEng ??
    errors.nameLongEng ??
    errors.abbreviationEng;

  return (
    <>
      <div className="flex items-center">
        {!expanded && hasHiddenErrors && (
          <div
            className="mr-2 w-1/2 text-hsl-red"
            data-testid={testIds.errorIndicator}
          >
            <span>{t('terminal.errors.expandToSeeErrors')}</span>
          </div>
        )}
        <ExpandButton
          className="ml-auto"
          ariaControls={ID}
          expanded={expanded}
          expandedText={t('terminal.showDetails')}
          onClick={() => setExpanded((p) => !p)}
          testId={testIds.showHideButton}
          iconClassName="text-base"
        />
      </div>
      <Transition
        as="div"
        className="mt-2 flex flex-row flex-wrap gap-8 py-2"
        id={ID}
        role="region"
        show={expanded}
        aria-hidden={!expanded}
        aria-labelledby={HeaderId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accordionClassNames}
      >
        <FormRow mdColumns={3} className="sm:gap-x-4 md:gap-x-4 lg:gap-x-4">
          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="nameSwe"
            testId={testIds.nameSwe}
          />

          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="nameLongFin"
            testId={testIds.nameLongFin}
          />
          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="nameLongSwe"
            testId={testIds.nameLongSwe}
          />

          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="abbreviationFin"
            testId={testIds.abbreviationFin}
          />
          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="abbreviationSwe"
            testId={testIds.abbreviationSwe}
          />
          <div className="hidden md:block" />

          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="nameEng"
            testId={testIds.nameEng}
          />
          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="nameLongEng"
            testId={testIds.nameLongEng}
          />
          <InputField<TerminalFormState>
            type="text"
            translationPrefix="terminalDetails.basicDetails"
            fieldPath="abbreviationEng"
            testId={testIds.abbreviationEng}
          />
        </FormRow>
      </Transition>
    </>
  );
};
