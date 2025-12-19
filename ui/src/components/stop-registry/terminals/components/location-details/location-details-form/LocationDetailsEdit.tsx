import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  MemberStopQuayDetailsFragment,
  MemberStopStopPlaceDetailsFragment,
} from '../../../../../../generated/graphql';
import { Column, Row } from '../../../../../../layoutComponents';
import { Operation } from '../../../../../../redux';
import { mapToISODate } from '../../../../../../time';
import { EnrichedParentStopPlace } from '../../../../../../types';
import {
  KnownValueKey,
  findKeyValue,
  notNullish,
  showSuccessToast,
} from '../../../../../../utils';
import { useLoader } from '../../../../../common/hooks/useLoader';
import {
  FormActionButtons,
  FormColumn,
  InputField,
  InputLabel,
} from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { SelectedStop } from '../../../../components/SelectMemberStops/common/schema';
import { MemberPlatforms } from '../LocationDetailsMemberPlatforms';
import { SelectTerminalMemberStopsDropdown } from '../member-stops';
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

function mapQuayToSelectedStop(
  terminal: EnrichedParentStopPlace,
  stopPlace: MemberStopStopPlaceDetailsFragment,
  quay: MemberStopQuayDetailsFragment,
): SelectedStop {
  const validityStart = mapToISODate(
    findKeyValue(quay, KnownValueKey.ValidityStart),
  );
  const validityEnd = mapToISODate(
    findKeyValue(quay, KnownValueKey.ValidityEnd),
  );
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
}

function extractSelectedStops(terminal: EnrichedParentStopPlace) {
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
}

function mapTerminalLocationDataToFormState(
  terminal: EnrichedParentStopPlace,
): TerminalLocationDetailsFormState {
  return {
    streetAddress: terminal.streetAddress ?? '',
    postalCode: terminal.postalCode ?? '',
    latitude: terminal.geometry?.coordinates?.[1] ?? 0,
    longitude: terminal.geometry?.coordinates?.[0] ?? 0,
    selectedStops: extractSelectedStops(terminal),
  };
}

type TerminalDetailsEditProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
  readonly onFinishEditing: () => void;
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
};

const TerminalLocationDetailsEditImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  TerminalDetailsEditProps
> = ({ terminal, className, onFinishEditing, onCancel, testIdPrefix }, ref) => {
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
            <Column>
              <InputLabel
                fieldPath="municipality"
                translationPrefix="terminalDetails.location"
              />
              <div
                className="flex h-full items-center"
                title={t('stopDetails.location.municipalityInputNote')}
              >
                <span
                  id="terminalDetails.location.municipality"
                  data-testid={testIds.municipality}
                >
                  {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    terminal.municipality || '-'
                  }
                </span>
                <i className="icon-info text-lg text-brand" />
              </div>
            </Column>
            <Column>
              <InputLabel
                fieldPath="fareZone"
                translationPrefix="terminalDetails.location"
              />
              <div
                className="flex h-full items-center"
                title={t('stopDetails.location.fareZoneInputNote')}
              >
                <span
                  id="terminalDetails.location.fareZone"
                  data-testid={testIds.fareZone}
                >
                  {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    terminal.fareZone || '-'
                  }
                </span>
                <i className="icon-info text-lg text-brand" />
              </div>
            </Column>
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
          <Row className="gap-4">
            <div className="lg:w-1/2">
              <div className="mb-2 text-sm font-bold">
                {t('terminalDetails.location.memberStopsTotal', {
                  total: selectedStops.length,
                })}
              </div>
              <SelectTerminalMemberStopsDropdown
                value={selectedStops}
                onChange={onSelectedStopsChange}
                testId={testIds.memberStops}
              />
            </div>
            <MemberPlatforms
              terminal={terminal}
              className="justify-end lg:w-1/2"
            />
          </Row>
        </FormColumn>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
        />
      </form>
    </FormProvider>
  );
};

export const TerminalLocationDetailsEdit = forwardRef(
  TerminalLocationDetailsEditImpl,
);
