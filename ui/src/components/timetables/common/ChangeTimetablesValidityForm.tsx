import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Row, Visible } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import {
  FormColumn,
  FormRow,
  InputField,
  requiredString,
} from '../../forms/common';
import { AffectedRouteLabels } from './AffectedRouteLabels';

export const schema = z.object({
  validityStart: requiredString.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
  validityEnd: requiredString.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormState>;
  className?: string;
  onSubmit: (state: FormState) => void;
  onCancel: () => void;
  affectedRouteLabels: ReadonlyArray<string>;
}

const testIds = {
  saveButton: 'ChangeTimetablesValidityForm::saveButton',
  startDateInput: 'ChangeTimetablesValidityForm::startDateInput',
  endDateInput: 'ChangeTimetablesValidityForm::endDateInput',
};

export const ChangeTimetablesValidityForm = ({
  defaultValues,
  className = '',
  onSubmit,
  onCancel,
  affectedRouteLabels,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        id="confirm-timetables-import-form"
        className={className}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <h3 className="mb-6">{t('changeTimetablesValidityModal.validity')}</h3>
        <FormColumn>
          <FormRow mdColumns={2}>
            <InputField<FormState>
              type="date"
              translationPrefix="validityPeriod"
              fieldPath="validityStart"
              testId={testIds.startDateInput}
            />
            <InputField<FormState>
              type="date"
              translationPrefix="validityPeriod"
              fieldPath="validityEnd"
              testId={testIds.endDateInput}
            />
          </FormRow>
        </FormColumn>
        <Visible visible={affectedRouteLabels.length > 1}>
          <AffectedRouteLabels
            affectedRouteLabels={affectedRouteLabels}
            text={t('changeTimetablesValidityModal.noticeChangesInRoutes')}
          />
        </Visible>
        <Row className="mt-6 justify-end space-x-4">
          <SimpleButton onClick={onCancel} inverted>
            {t('cancel')}
          </SimpleButton>
          <SimpleButton testId={testIds.saveButton} onClick={onSave}>
            {t('save')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
