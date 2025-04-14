import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { FormColumn } from '../../common';
import { FindStopArea } from './FindStopArea';
import { PublicCode } from './PublicCode';
import { PublicCodePrefixMissmatchWarning } from './PublicCodePrefixMissmatchWarning';
import { StopAreaInfoSection } from './StopAreaInfoSection';

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
        <PublicCode className="min-w-0" editing={editing} />

        <FindStopArea className="w-full" disabled={editing} />
      </div>

      <PublicCodePrefixMissmatchWarning />

      <StopAreaInfoSection />
    </FormColumn>
  );
};
