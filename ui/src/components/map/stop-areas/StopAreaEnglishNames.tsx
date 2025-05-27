import { Transition } from '@headlessui/react';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ExpandButton } from '../../../uiComponents';
import { FormRow, InputField } from '../../forms/common';
import { StopAreaFormState } from '../../forms/stop-area';
import { accordionClassNames } from '../../stop-registry/stops/versions/utils';

const ID = 'StopAreaEngNameSection';
const HeaderId = 'StopAreaEngNameSection::Header';

const testIds = {
  showHideButtonEng: 'StopAreaFormComponent::showHideButtonEng',
  nameEng: 'StopAreaFormComponent::nameEng',
  nameLongEng: 'StopAreaFormComponent::nameLongEng',
  abbreviationEng: 'StopAreaFormComponent::abbreviationEng',
  errorIndicator: 'StopAreaFormComponent::errorIndicator',
};

export const StopAreaEnglishNames: FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const {
    formState: { errors },
  } = useFormContext<StopAreaFormState>();

  // Check if there are any errors in the fields that are hidden when collapsed
  const hasHiddenErrors =
    errors.nameEng ?? errors.nameLongEng ?? errors.abbreviationEng;

  return (
    <>
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
        expandedText={t('stopAreaDetails.englishNames')}
        onClick={() => setExpanded((p) => !p)}
        testId={testIds.showHideButtonEng}
        iconClassName="text-base"
      />

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
        <FormRow mdColumns={3} className="sm:gap-x-3 md:gap-x-3 lg:gap-x-3">
          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopAreaDetails.basicDetails"
            fieldPath="nameEng"
            testId={testIds.nameEng}
          />

          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopAreaDetails.basicDetails"
            fieldPath="nameLongEng"
            testId={testIds.nameLongEng}
          />

          <InputField<StopAreaFormState>
            type="text"
            translationPrefix="stopAreaDetails.basicDetails"
            fieldPath="abbreviationEng"
            testId={testIds.abbreviationEng}
          />
        </FormRow>
      </Transition>
    </>
  );
};
