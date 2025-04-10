import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { FormColumn, InputField } from '../../common';
import { StopFormState as FormState } from '../types';
import { FindStopArea } from './FindStopArea';
import { StopAreaInfoSection } from './StopAreaInfoSection';

const testIds = {
  label: 'StopFormComponent::label',
};

type PublicCodeAndAreaProps = {
  readonly className?: string;
  readonly editing: boolean;
};

export const PublicCodeAndArea: FC<PublicCodeAndAreaProps> = ({
  className,
  editing,
}) => {
  return (
    <FormColumn className={twMerge('bg-background', className)}>
      <div className="flex gap-4">
        <InputField<FormState>
          className="min-w-0"
          type="text"
          translationPrefix="stops"
          fieldPath="label"
          testId={testIds.label}
          disabled={editing}
        />

        <FindStopArea disabled={editing} className="w-full" />
      </div>

      <StopAreaInfoSection />
    </FormColumn>
  );
};
