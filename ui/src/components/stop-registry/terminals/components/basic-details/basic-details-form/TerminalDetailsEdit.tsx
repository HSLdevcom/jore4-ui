import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  MemberStopQuayDetailsFragment,
  MemberStopStopPlaceDetailsFragment,
} from '../../../../../../generated/graphql';
import { useLoader } from '../../../../../../hooks';
import { Column } from '../../../../../../layoutComponents';
import { Operation } from '../../../../../../redux';
import { mapToISODate } from '../../../../../../time';
import { EnrichedParentStopPlace } from '../../../../../../types';
import {
  findKeyValue,
  mapLngLatToPoint,
  notNullish,
  showSuccessToast,
} from '../../../../../../utils';
import { FormColumn, FormRow, InputField } from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { AlternativeNamesEdit } from '../../../../components/AlternativeNames/AlternativeNamesEdit';
import { SelectedStop } from '../../../../components/SelectMemberStops/schema';
import { TerminalTypeDropdown } from '../../../../components/TerminalTypeDropdown';
import { TerminalType } from '../../../../types/TerminalType';
import { TerminalFormState, terminalFormSchema } from './schema';
import { useUpdateTerminalDetails } from './useUpdateTerminalDetails';

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

const mapQuayToSelectedStop = (
  terminal: EnrichedParentStopPlace,
  stopPlace: MemberStopStopPlaceDetailsFragment,
  quay: MemberStopQuayDetailsFragment,
): SelectedStop => {
  const validityStart = mapToISODate(findKeyValue(quay, 'validityStart'));
  const validityEnd = mapToISODate(findKeyValue(quay, 'validityEnd'));
  return {
    stopPlaceId: stopPlace?.id ?? '',
    stopPlaceParentId: terminal.id ?? null,
    name: stopPlace?.name?.value ?? '',
    quayId: quay?.id ?? '',
    publicCode: quay?.publicCode ?? '',
    validityStart: validityStart ?? '',
    validityEnd: validityEnd ?? '',
    indefinite: !validityEnd,
  };
};

const extractSelectedStops = (terminal: EnrichedParentStopPlace) => {
  return (
    terminal.children
      ?.filter(notNullish)
      .flatMap(
        (child) =>
          child.quays
            ?.filter(notNullish)
            .map((quay) => mapQuayToSelectedStop(terminal, child, quay)) ?? [],
      ) ?? []
  );
};

export const mapTerminalDataToFormState = (
  terminal: EnrichedParentStopPlace,
): TerminalFormState => {
  const { latitude, longitude } = mapLngLatToPoint(
    terminal.geometry?.coordinates ?? [],
  );

  return {
    privateCode: terminal.privateCode?.value ?? '',
    description: {
      lang: terminal.description?.lang ?? null,
      value: terminal.description?.value ?? null,
    },
    name: terminal.name ?? '',
    nameSwe: terminal.nameSwe ?? '',
    nameEng: terminal.nameEng,
    nameLongFin: terminal.nameLongFin,
    nameLongSwe: terminal.nameLongSwe,
    nameLongEng: terminal.nameLongEng,
    abbreviationFin: terminal.abbreviationFin,
    abbreviationSwe: terminal.abbreviationSwe,
    abbreviationEng: terminal.abbreviationEng,
    validityStart: mapToISODate(terminal.validityStart) ?? '',
    validityEnd: mapToISODate(terminal.validityEnd),
    indefinite: !terminal.validityEnd,
    terminalType: terminal.terminalType
      ? (terminal.terminalType as TerminalType)
      : undefined,
    departurePlatforms: terminal.departurePlatforms,
    arrivalPlatforms: terminal.arrivalPlatforms,
    loadingPlatforms: terminal.loadingPlatforms,
    electricCharging: terminal.electricCharging,
    latitude,
    longitude,
    selectedStops: extractSelectedStops(terminal),
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

  const { updateTerminalDetails, defaultErrorHandler } =
    useUpdateTerminalDetails();
  const { setIsLoading } = useLoader(Operation.ModifyTerminal);
  const onSubmit = async (state: TerminalFormState) => {
    setIsLoading(true);
    try {
      await updateTerminalDetails({ terminal, state });

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
                translationPrefix="terminalDetails.basicDetails"
                fieldPath="terminalType"
                testId={testIds.terminalType}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={(props) => (
                  <TerminalTypeDropdown
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                  />
                )}
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
