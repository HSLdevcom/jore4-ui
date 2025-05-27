import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../../../../../../hooks';
import { Row } from '../../../../../../layoutComponents';
import { Operation } from '../../../../../../redux';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { showSuccessToast } from '../../../../../../utils';
import { FormColumn, InputField } from '../../../../../forms/common';
import {
  TerminalLocationDetailsFormState,
  terminalLocationDetailsFormSchema,
} from './schema';
import { useUpsertTerminalLocationDetails } from './useEditTerminalLocationDetails';

const testIds = {
  streetAddress: 'TerminalLocationDetailsEdit::streetAddress',
  postalCode: 'TerminalLocationDetailsEdit::postalCode',
  municipality: 'TerminalLocationDetailsEdit::municipality',
  fareZone: 'TerminalLocationDetailsEdit::fareZone',
  latitude: 'TerminalLocationDetailsEdit::latitude',
  longitude: 'TerminalLocationDetailsEdit::longitude',
  memberStops: 'TerminalLocationDetailsEdit::memberStops',
};

const mapTerminalLocationDataToFormState = (
  terminal: EnrichedParentStopPlace,
): TerminalLocationDetailsFormState => {
  return {
    streetAddress: terminal.streetAddress ?? '',
    postalCode: terminal.postalCode ?? '',
    municipality: terminal.municipality ?? '',
    fareZone: terminal.fareZone ?? '',
    latitude: terminal.geometry?.coordinates?.[1] ?? 0,
    longitude: terminal.geometry?.coordinates?.[0] ?? 0,
  };
};

type TerminalDetailsEditProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
  readonly onFinishEditing: () => void;
};

const TerminalLocationDetailsEditImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  TerminalDetailsEditProps
> = ({ terminal, className = '', onFinishEditing }, ref) => {
  const { t } = useTranslation();
  const { upsertTerminalLocationDetails, defaultErrorHandler } =
    useUpsertTerminalLocationDetails();
  const { setIsLoading } = useLoader(Operation.ModifyTerminal);
  const onSubmit = async (state: TerminalLocationDetailsFormState) => {
    setIsLoading(true);
    try {
      await upsertTerminalLocationDetails({ terminal, state });

      showSuccessToast(t('terminalDetails.editSuccess'));
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  const defaultValues = useMemo(
    () => mapTerminalLocationDataToFormState(terminal),
    [terminal],
  );
  const methods = useForm<TerminalLocationDetailsFormState>({
    defaultValues,
    resolver: zodResolver(terminalLocationDetailsFormSchema),
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <FormColumn>
          <Row className="flex-wrap gap-4">
            <InputField<TerminalLocationDetailsFormState>
              type="text"
              translationPrefix="terminalDetails.location"
              fieldPath="streetAddress"
              testId={testIds.streetAddress}
            />
            <InputField<TerminalLocationDetailsFormState>
              type="text"
              inputClassName="w-24"
              translationPrefix="terminalDetails.location"
              fieldPath="postalCode"
              testId={testIds.postalCode}
            />
            <InputField<TerminalLocationDetailsFormState>
              type="text"
              inputClassName="w-24"
              translationPrefix="terminalDetails.location"
              fieldPath="municipality"
              testId={testIds.municipality}
            />
            <InputField<TerminalLocationDetailsFormState>
              type="text"
              inputClassName="w-24"
              translationPrefix="terminalDetails.location"
              fieldPath="fareZone"
              testId={testIds.fareZone}
            />
          </Row>
          <Row className="flex-wrap gap-4">
            <InputField<TerminalLocationDetailsFormState>
              type="number"
              inputClassName="w-32"
              translationPrefix="terminalDetails.location"
              disabled
              size={3}
              fieldPath="latitude"
              testId={testIds.latitude}
            />
            <InputField<TerminalLocationDetailsFormState>
              type="number"
              inputClassName="w-32"
              translationPrefix="terminalDetails.location"
              disabled
              fieldPath="longitude"
              testId={testIds.longitude}
            />
          </Row>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const TerminalLocationDetailsEdit = forwardRef(
  TerminalLocationDetailsEditImpl,
);
