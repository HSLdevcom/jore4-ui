import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useLoader } from '../../../../../hooks';
import { Column } from '../../../../../layoutComponents';
import { Operation } from '../../../../../redux';
import { mapToISODate } from '../../../../../time';
import { EnrichedStopPlace } from '../../../../../types';
import { mapLngLatToPoint, showSuccessToast } from '../../../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  ValidityPeriodForm,
} from '../../../../forms/common';
import {
  StopAreaFormState as FormState,
  StopAreaFormState,
  stopAreaFormSchema,
  useUpsertStopArea,
} from '../../../../forms/stop-area';
import { AlternativeNamesEdit } from '../../../components/AlternativeNames/AlternativeNamesEdit';

const testIds = {
  privateCode: 'StopAreaDetailsEdit::privateCode',
  name: 'StopAreaDetailsEdit::name',
  nameSwe: 'StopAreaDetailsEdit::nameSwe',
  nameEng: 'StopAreaDetailsEdit::nameEng',
  nameLongFin: 'StopAreaDetailsEdit::nameLongFin',
  nameLongSwe: 'StopAreaDetailsEdit::nameLongSwe',
  nameLongEng: 'StopAreaDetailsEdit::nameLongEng',
  abbreviationFin: 'StopAreaDetailsEdit::abbreviationFin',
  abbreviationSwe: 'StopAreaDetailsEdit::abbreviationSwe',
  abbreviationEng: 'StopAreaDetailsEdit::abbreviationEng',
  latitude: 'StopAreaDetailsEdit::latitude',
  longitude: 'StopAreaDetailsEdit::longitude',
};

export const mapStopAreaDataToFormState = (
  area: EnrichedStopPlace,
): Partial<FormState> => {
  const { latitude, longitude } = mapLngLatToPoint(
    area.geometry?.coordinates ?? [],
  );

  return {
    privateCode: area.privateCode?.value ?? undefined,
    name: area.name ?? undefined,
    nameSwe: area.nameSwe ?? undefined,
    nameEng: area.nameEng ?? undefined,
    nameLongFin: area.nameLongFin ?? undefined,
    nameLongSwe: area.nameLongSwe ?? undefined,
    nameLongEng: area.nameLongEng ?? undefined,
    abbreviationFin: area.abbreviationFin ?? undefined,
    abbreviationSwe: area.abbreviationSwe ?? undefined,
    abbreviationEng: area.abbreviationEng ?? undefined,
    latitude,
    longitude,
    validityStart: mapToISODate(area.validityStart),
    validityEnd: mapToISODate(area.validityEnd),
    indefinite: !area.validityEnd,
    quays: (area.quays ?? []).map((quay) => ({
      id: quay?.id ?? '',
      name: {
        value: quay?.description?.value ?? '',
        lang: quay?.description?.lang ?? '',
      },
      scheduled_stop_point: {
        label: quay?.scheduled_stop_point?.label ?? '',
      },
    })),
  };
};

type StopAreaDetailsEditProps = {
  readonly area: EnrichedStopPlace;
  readonly className?: string;
  readonly refetch: () => Promise<unknown>;
  readonly onFinishEditing: () => void;
};

const StopAreaDetailsEditImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  StopAreaDetailsEditProps
> = ({ area, className = '', onFinishEditing, refetch }, ref) => {
  const { t } = useTranslation();

  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();
  const { setIsLoading } = useLoader(Operation.ModifyStopArea);
  const onSubmit = async (state: StopAreaFormState) => {
    setIsLoading(true);
    try {
      await upsertStopArea({ stop: area, state });
      await refetch();

      showSuccessToast(t('stopArea.editSuccess'));
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const defaultValues = useMemo(() => mapStopAreaDataToFormState(area), [area]);
  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });
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
          <FormRow lgColumns={4} mdColumns={2}>
            <Column>
              <InputField<FormState>
                type="text"
                translationPrefix="stopAreaDetails.basicDetails"
                fieldPath="privateCode"
                testId={testIds.privateCode}
                disabled
              />
            </Column>
            <Column>
              <InputField<FormState>
                type="text"
                translationPrefix="stopAreaDetails.basicDetails"
                fieldPath="name"
                testId={testIds.name}
              />
            </Column>
            <Column>
              <InputField<FormState>
                type="text"
                translationPrefix="stopAreaDetails.basicDetails"
                fieldPath="nameSwe"
                testId={testIds.nameSwe}
              />
            </Column>
          </FormRow>
          <AlternativeNamesEdit />
          <FormRow lgColumns={4} mdColumns={2}>
            <Column>
              <InputField<FormState>
                type="number"
                translationPrefix="map"
                fieldPath="latitude"
                testId={testIds.latitude}
                step="any"
                disabled
              />
            </Column>
            <Column>
              <InputField<FormState>
                type="number"
                translationPrefix="map"
                fieldPath="longitude"
                testId={testIds.longitude}
                step="any"
                disabled
              />
            </Column>
          </FormRow>
          <FormRow lgColumns={2} mdColumns={1}>
            <ValidityPeriodForm />
          </FormRow>
        </FormColumn>
      </form>
    </FormProvider>
  );
};

export const StopAreaDetailsEdit = forwardRef(StopAreaDetailsEditImpl);
