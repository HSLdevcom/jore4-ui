import { zodResolver } from '@hookform/resolvers/zod';
import noop from 'lodash/noop';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';
import { RouteTypeOfLineEnum } from '../../../../generated/graphql';
import { Row } from '../../../../layoutComponents';
import { mapToISODate } from '../../../../time';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import { ConfirmationDialog, SimpleButton } from '../../../../uiComponents';
import { AllOptionEnum, submitFormByRef } from '../../../../utils';
import {
  PeriodType,
  RandomReferenceFormState,
  randomReferenceDayFormSchema,
} from './RandomReferenceDayForm.types';
import { RandomReferenceDayFormRow } from './RandomReferenceDayFormRow';

const testIds = {
  cancelButton: 'RandomReferenceDayForm::cancelButton',
  saveButton: 'RandomReferenceDayForm::saveButton',
  addRowButton: 'RandomReferenceDayForm::addRowButton',
};

const generateLineTypes = (): string => {
  const val: string[] = Object.values(RouteTypeOfLineEnum);
  val.push(AllOptionEnum.All);
  return val.join(',');
};

const emptyRowObject: PeriodType = {
  periodName: '',
  lineTypes: generateLineTypes(),
  substituteDayOfWeek: SubstituteDayOfWeek.NoTraffic,
  beginDate: mapToISODate(DateTime.now()) ?? '',
  endDate: mapToISODate(DateTime.now()) ?? '',
  beginTime: '04:30',
  endTime: '28:30',
};

export const RandomReferenceDayForm = ({
  onSubmit,
  onRemove,
  values,
  setIsDirty,
}: {
  onSubmit: (state: RandomReferenceFormState) => void;
  onRemove: (id: UUID) => void;
  values?: RandomReferenceFormState;
  setIsDirty: (isDirty: boolean) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const [isReseting, setIsReseting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowUnderDeleteOperation, setRowUnderDeleteOperation] = useState<{
    id: string;
    callback: () => void;
  }>({
    id: '',
    callback: noop,
  });
  const formRef = useRef<ExplicitAny>(null);
  const methods = useForm<RandomReferenceFormState>({
    values,
    resolver: zodResolver(randomReferenceDayFormSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const { append, fields, remove } = useFieldArray({
    control,
    name: 'periods',
  });

  const onSave = () => {
    submitFormByRef(formRef);
  };

  // Updates form dirty state to parent component. Parent component gives it to FilterForm
  useEffect(() => setIsDirty(isDirty), [isDirty, setIsDirty]);

  const handleDelete = () => {
    const { id } = rowUnderDeleteOperation;
    rowUnderDeleteOperation?.callback();
    if (id) onRemove(id);
    reset(values);
    setIsDeleting(false);
  };

  const handleRowRemove = (index: number, id: string | undefined) => {
    if (id) setRowUnderDeleteOperation({ id, callback: () => remove(index) });
    setIsDeleting(true);
  };

  const onReset = () => {
    setIsReseting(false);
    reset();
  };

  return (
    <div className="my-8">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <RandomReferenceDayFormRow
              field={field}
              index={index}
              key={field.id}
              handleRowRemove={handleRowRemove}
            />
          ))}
          <Row className="my-8 items-center space-x-4">
            <span className="text-brand-darker">
              {t('timetables.settings.addRow')}
            </span>
            <SimpleButton
              className="h-full !px-3 text-xl"
              onClick={() => append(emptyRowObject)}
              testId={testIds.addRowButton}
            >
              <AiOutlinePlus aria-label={t('timetables.settings.addRow')} />
            </SimpleButton>
          </Row>
          <Row className="my-8 justify-end space-x-4">
            <SimpleButton
              onClick={() => setIsReseting(true)}
              id="cancel-button"
              testId={testIds.cancelButton}
              inverted
            >
              {t('cancel')}
            </SimpleButton>

            <SimpleButton
              onClick={onSave}
              id="save-button"
              testId={testIds.saveButton}
            >
              {t('save')}
            </SimpleButton>
          </Row>
        </form>
      </FormProvider>
      <ConfirmationDialog
        isOpen={isReseting}
        onCancel={() => setIsReseting(false)}
        onConfirm={onReset}
        title={t('confirmResetReferenceDayDialog.title')}
        description={t('confirmResetReferenceDayDialog.description')}
        confirmText={t('confirmResetReferenceDayDialog.confirmText')}
        cancelText={t('confirmResetReferenceDayDialog.cancelText')}
      />
      <ConfirmationDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title={t('confirmDeleteReferenceDayDialog.title')}
        description={t('confirmDeleteReferenceDayDialog.description')}
        confirmText={t('confirmDeleteReferenceDayDialog.confirmText')}
        cancelText={t('confirmDeleteReferenceDayDialog.declineText')}
      />
    </div>
  );
};
