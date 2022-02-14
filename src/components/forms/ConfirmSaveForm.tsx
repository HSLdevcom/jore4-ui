import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Column, Row } from '../../layoutComponents';
import { Priority } from '../../types/Priority';
import { SimpleButton } from '../../uiComponents';

export const schema = z.object({
  priority: z.nativeEnum(Priority),
  validityStart: z
    .string()
    .min(1)
    .regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
  validityEnd: z.string(),
  indefinite: z.boolean(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  className?: string;
}

export const ConfirmSaveForm = ({ className }: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormState>();

  const indefinite = watch('indefinite');
  const priority = watch('priority');
  const setPriority = (value: Priority) => setValue('priority', value);

  return (
    <div className={className || ''}>
      <h2 className="pb-6 text-xl font-bold">
        {t('saveChangesModal.validityPeriod')}
      </h2>

      <Row className="mb-4">
        <Column>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>{t('priority.label')}</label>
          <Row className="space-x-2">
            <SimpleButton
              onClick={() => setPriority(Priority.Standard)}
              inverted={priority !== Priority.Standard}
            >
              {t('priority.standard')}
            </SimpleButton>
            <SimpleButton
              onClick={() => setPriority(Priority.Draft)}
              inverted={priority !== Priority.Draft}
            >
              {t('priority.draft')}
            </SimpleButton>
            <SimpleButton
              onClick={() => setPriority(Priority.Temporary)}
              inverted={priority !== Priority.Temporary}
            >
              {t('priority.temporary')}
            </SimpleButton>
          </Row>
          <p>{errors.priority && t('formValidation.required')}</p>
        </Column>
      </Row>
      <Row className="space-x-4">
        <Column>
          <label htmlFor="validityStart">
            {t('saveChangesModal.validityStart')}
          </label>
          <input type="date" {...register('validityStart', {})} />
          <p>
            {errors.validityStart?.type === 'too_small' &&
              t('formValidation.required')}
          </p>
        </Column>
        <Column>
          <label htmlFor="validityEnd" className={indefinite ? 'hidden' : ''}>
            {t('saveChangesModal.validityEnd')}
          </label>
          <input
            type="date"
            {...register('validityEnd', {})}
            className="disabled:hidden"
            disabled={indefinite}
          />
        </Column>
      </Row>
      <Row>
        <input
          type="checkbox"
          id="indefinite"
          {...register('indefinite', {})}
          className="mr-2 "
        />
        <label htmlFor="indefinite" className="self-center font-normal">
          {t('saveChangesModal.indefinite')}
        </label>
      </Row>
    </div>
  );
};
