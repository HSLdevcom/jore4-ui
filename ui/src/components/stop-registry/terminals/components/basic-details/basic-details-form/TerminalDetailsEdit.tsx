import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useLoader } from '../../../../../../hooks';
import { Column } from '../../../../../../layoutComponents';
import { Operation } from '../../../../../../redux';
import { mapToISODate } from '../../../../../../time';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { showSuccessToast } from '../../../../../../utils';
import { FormColumn, FormRow, InputField } from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { AlternativeNamesEdit } from '../../../../components/AlternativeNames/AlternativeNamesEdit';
import { TerminalFormState, terminalFormSchema } from './schema';
import { useUpsertTerminalDetails } from './useEditTerminalDetails';

const testIds = {
  privateCode: 'TerminalDetailsEdit::privateCode',
  description: 'TerminalDetailsEdit::description',
  name: 'TerminalDetailsEdit::name',
  nameSwe: 'TerminalDetailsEdit::nameSwe',
  terminalType: 'TerminalDetailsEdit::terminalType',
  departurePlatforms: 'TerminalDetailsEdit::departurePlatforms',
  arrivalPlatforms: 'TerminalDetailsEdit::arrivalPlatforms',
  loadingPlatforms: 'TerminalDetailsEdit::loadingPlatforms',
  electricCharging: 'TerminalDetailsEdit::electricCharging',
};

export const mapTerminalDataToFormState = (
  terminal: EnrichedParentStopPlace,
): Partial<TerminalFormState> => {
  return {
    privateCode: terminal.privateCode?.value ?? undefined,
    description: {
      lang: terminal.description?.lang ?? null,
      value: terminal.description?.value ?? null,
    },
    name: terminal.name ?? undefined,
    nameSwe: terminal.nameSwe ?? undefined,
    nameEng: terminal.nameEng ?? undefined,
    nameLongFin: terminal.nameLongFin ?? undefined,
    nameLongSwe: terminal.nameLongSwe ?? undefined,
    nameLongEng: terminal.nameLongEng ?? undefined,
    abbreviationFin: terminal.abbreviationFin ?? undefined,
    abbreviationSwe: terminal.abbreviationSwe ?? undefined,
    abbreviationEng: terminal.abbreviationEng ?? undefined,
    validityStart: mapToISODate(terminal.validityStart),
    validityEnd: mapToISODate(terminal.validityEnd),
    indefinite: !terminal.validityEnd,
    terminalType: terminal.terminalType ?? undefined,
    departurePlatforms: terminal.departurePlatforms ?? undefined,
    arrivalPlatforms: terminal.arrivalPlatforms ?? undefined,
    loadingPlatforms: terminal.loadingPlatforms ?? undefined,
    electricCharging: terminal.electricCharging ?? undefined,
  };
};

type TerminalDetailsEditProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
  readonly onFinishEditing: () => void;
};

const TerminalDetailsEditImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  TerminalDetailsEditProps
> = ({ terminal, className = '', onFinishEditing }, ref) => {
  const { t } = useTranslation();

  const { upsertTerminalDetails, defaultErrorHandler } =
    useUpsertTerminalDetails();
  const { setIsLoading } = useLoader(Operation.ModifyTerminal);
  const onSubmit = async (state: TerminalFormState) => {
    setIsLoading(true);
    try {
      await upsertTerminalDetails({ terminal, state });

      showSuccessToast(t('terminalDetails.editSuccess'));
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  const defaultValues = useMemo(
    () => mapTerminalDataToFormState(terminal),
    [terminal],
  );
  const methods = useForm<TerminalFormState>({
    defaultValues,
    resolver: zodResolver(terminalFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'TerminalDetailsEdit');
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-6', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <FormColumn>
          <FormRow lgColumns={3} mdColumns={2}>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="privateCode"
                testId={testIds.privateCode}
                disabled
              />
            </Column>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="name"
                testId={testIds.name}
              />
            </Column>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="nameSwe"
                testId={testIds.nameSwe}
              />
            </Column>
          </FormRow>
          <FormRow mdColumns={1}>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="stopDetails"
                fieldPath="description.value"
                testId={testIds.description}
                customTitlePath="terminalDetails.basicDetails.description"
              />
            </Column>
          </FormRow>
          <AlternativeNamesEdit />
          <FormRow lgColumns={5} mdColumns={2}>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="terminalType"
                testId={testIds.terminalType}
              />
            </Column>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="departurePlatforms"
                testId={testIds.departurePlatforms}
              />
            </Column>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="arrivalPlatforms"
                testId={testIds.arrivalPlatforms}
              />
            </Column>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="loadingPlatforms"
                testId={testIds.loadingPlatforms}
              />
            </Column>
            <Column>
              <InputField<TerminalFormState>
                type="text"
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="electricCharging"
                testId={testIds.electricCharging}
              />
            </Column>
          </FormRow>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const TerminalDetailsEdit = forwardRef(TerminalDetailsEditImpl);
