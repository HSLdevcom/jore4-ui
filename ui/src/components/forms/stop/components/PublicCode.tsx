import React, { FC, useEffect, useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InputField } from '../../common';
import { StopFormState } from '../types';
import { useGetPublicCodeCandidates } from '../utils/useGetPublicCodeCanditates';

const testIds = {
  publicCode: 'StopFormComponent::publicCode',
  publicCodeCandidate: (code: string) =>
    `StopFormComponent::publicCode::candidate::${code}`,
};

type PublicCodeProps = {
  readonly className?: string;
  readonly disabled: boolean;
};

export const PublicCode: FC<PublicCodeProps> = ({ className, disabled }) => {
  const { t } = useTranslation();
  const datalistId = useId();

  const { watch, setValue } = useFormContext<StopFormState>();

  const [query = '', latitude, longitude] = watch([
    'publicCode.value',
    'latitude',
    'longitude',
  ]);

  const { candidates, expectedPrefix, municipality, loading } =
    useGetPublicCodeCandidates({
      latitude,
      longitude,
      query,
      skip: disabled,
    });

  useEffect(() => {
    setValue('publicCode.expectedPrefix', expectedPrefix);
    setValue('publicCode.municipality', municipality);
  }, [expectedPrefix, municipality, setValue]);

  return (
    <>
      <InputField<StopFormState>
        autoComplete="off"
        className={className}
        list={datalistId}
        type="text"
        translationPrefix="stops"
        fieldPath="publicCode.value"
        customTitlePath="stops.publicCode"
        testId={testIds.publicCode}
        placeholder={loading ? t('stops.loadingUsedPublicCodes') : undefined}
        disabled={disabled || loading}
      />

      <datalist id={datalistId}>
        {candidates.map((publicCode) => (
          <option
            key={publicCode}
            value={publicCode}
            data-testid={testIds.publicCodeCandidate(publicCode)}
          >
            {publicCode}
          </option>
        ))}
      </datalist>
    </>
  );
};
