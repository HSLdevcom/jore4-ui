import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { FormColumn } from '../../common';
import { FindStopArea } from './FindStopArea';
import { PublicCode } from './PublicCode';
import { PublicCodePrefixMissmatchWarning } from './PublicCodePrefixMissmatchWarning';
import { StopAreaInfoSection } from './StopAreaInfoSection';

type PublicCodeAndAreaProps = {
  readonly className?: string;
  readonly publicCodeDisabled: boolean;
  readonly stopAreaDisabled: boolean;
};

export const PublicCodeAndArea: FC<PublicCodeAndAreaProps> = ({
  className,
  publicCodeDisabled,
  stopAreaDisabled,
}) => {
  return (
    <FormColumn className={twMerge('bg-background', className)}>
      <div className="flex gap-4">
        <PublicCode className="min-w-0" disabled={publicCodeDisabled} />

        <FindStopArea className="w-full" disabled={stopAreaDisabled} />
      </div>

      <PublicCodePrefixMissmatchWarning />

      <StopAreaInfoSection />
    </FormColumn>
  );
};
