import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../layoutComponents';
import { ValidationError } from '../../common';
import { StopFormState, StopPublicCodeState } from '../types';

function selectedCodeHasValidPrefix({
  value,
  expectedPrefix,
  municipality,
}: StopPublicCodeState): boolean {
  if (!expectedPrefix || !municipality || !value) {
    return true;
  }

  return value.startsWith(expectedPrefix);
}

type PublicCodePrefixMissmatchWarningProps = { readonly className?: string };

export const PublicCodePrefixMissmatchWarning: FC<
  PublicCodePrefixMissmatchWarningProps
> = ({ className }) => {
  const { t } = useTranslation();

  const publicCode = useFormContext<StopFormState>().watch<'publicCode'>(
    'publicCode',
    {
      value: '',
      expectedPrefix: null,
      municipality: null,
    },
  );

  if (selectedCodeHasValidPrefix(publicCode)) {
    return null;
  }

  return (
    <Column className={className}>
      <ValidationError
        errorMessage={t('stops.stopPublicCodePrefixMissmatch', publicCode)}
        fieldPath="PublicCodePrefixMissmatchWarning"
      />
    </Column>
  );
};
