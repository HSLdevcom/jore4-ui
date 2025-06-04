import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  MemberStopQuayDetailsFragment,
  MemberStopStopPlaceDetailsFragment,
} from '../../../../../../generated/graphql';
import { useLoader } from '../../../../../../hooks';
import { Row } from '../../../../../../layoutComponents';
import { Operation } from '../../../../../../redux';
import { mapToISODate } from '../../../../../../time';
import { EnrichedParentStopPlace } from '../../../../../../types';
import {
  findKeyValue,
  notNullish,
  showSuccessToast,
} from '../../../../../../utils';
import { FormColumn, InputField } from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { SelectMemberStopsDropdown } from '../member-stops/SelectMemberStopsDropdown';
import {
  SelectedStop,
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

function mapQuayToSelectedStop(
  stopPlace: MemberStopStopPlaceDetailsFragment,
  quay: MemberStopQuayDetailsFragment,
): SelectedStop {
  const validityStart = mapToISODate(findKeyValue(quay, 'validityStart'));
  const validityEnd = mapToISODate(findKeyValue(quay, 'validityEnd'));
  return {
    stopPlaceId: stopPlace?.id ?? '',
    name: stopPlace?.name?.value ?? '',
    quayId: quay?.id ?? '',
    publicCode: quay?.publicCode ?? '',
    validityStart: validityStart ?? '',
    validityEnd: validityEnd ?? '',
    indefinite: !validityEnd,
  };
}

function extractSelectedStops(terminal: EnrichedParentStopPlace) {
  return (
    terminal.children
      ?.filter(notNullish)
      .flatMap(
        (child) =>
          child.quays
            ?.filter(notNullish)
            .map((quay) => mapQuayToSelectedStop(child, quay)) ?? [],
      ) ?? []
  );
}

function mapTerminalLocationDataToFormState(
  terminal: EnrichedParentStopPlace,
): TerminalLocationDetailsFormState {
  return {
    streetAddress: terminal.streetAddress ?? '',
    postalCode: terminal.postalCode ?? '',
    municipality: terminal.municipality ?? '',
    fareZone: terminal.fareZone ?? '',
    latitude: terminal.geometry?.coordinates?.[1] ?? 0,
    longitude: terminal.geometry?.coordinates?.[0] ?? 0,
    selectedStops: extractSelectedStops(terminal),
  };
}

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
      await upsertTerminalLocationDetails({
        terminal,
        state,
        selectedStops: state.selectedStops,
      });

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
  useDirtyFormBlockNavigation(methods.formState, 'LocationDetailsEdit');
  const { handleSubmit } = methods;

  const {
    field: { value: selectedStops, onChange: onSelectedStopsChange },
  } = useController({
    name: 'selectedStops',
    control: methods.control,
    defaultValue: [],
  });

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
          <Row className="flex-col">
            <div className="mb-2 text-sm font-bold">
              {t('terminalDetails.location.memberStops')}
            </div>
            <SelectMemberStopsDropdown
              className="lg:w-1/2"
              value={selectedStops}
              onChange={onSelectedStopsChange}
              testId={testIds.memberStops}
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
