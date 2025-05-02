import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, useCallback, useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { HorizontalSeparator, Visible } from '../../../../layoutComponents';
import { AddNewButton } from '../../../../uiComponents/AddNewButton';
import { ExternalLinksFormFields } from './ExternalLinksFormFields';
import {
  ExternalLinksFormSchema,
  ExternalLinksFormState,
  mapExternalLinkDataToFormState,
} from './schema';

const testIds = {
  externalLink: 'ExternalLinksForm::externalLink',
  addExternalLink: 'ExternalLinksForm::addExternalLink',
  deleteExternalLink: 'ExternalLinksForm::deleteExternalLink',
};

type Props = {
  readonly className?: string;
  readonly defaultValues: ExternalLinksFormState;
  readonly onSubmit: (state: ExternalLinksFormState) => void;
};

const ExternalLinksFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  Props
> = ({ className, defaultValues, onSubmit }, ref) => {
  const { t } = useTranslation();

  const methods = useForm<ExternalLinksFormState>({
    defaultValues,
    resolver: zodResolver(ExternalLinksFormSchema),
  });
  const { control, setValue, getValues, handleSubmit } = methods;

  const { append, fields: externalLinks } = useFieldArray({
    control,
    name: 'externalLinks',
  });

  const addNewExternalLink = useCallback(() => {
    append(mapExternalLinkDataToFormState({}));
  }, [append]);

  useEffect(() => {
    if (externalLinks.length === 0) {
      addNewExternalLink();
    }
  }, [externalLinks.length, addNewExternalLink]);

  const onRemoveExternalLink = (idx: number) => {
    const newToBeDeleted = !getValues(`externalLinks.${idx}.toBeDeleted`);
    setValue(`externalLinks.${idx}.toBeDeleted`, newToBeDeleted, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const isLast = (idx: number) => idx === externalLinks.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-4', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        {externalLinks.map((externalLink, idx) => (
          <div key={externalLink.id} data-testid={testIds.externalLink}>
            <ExternalLinksFormFields
              index={idx}
              onRemove={onRemoveExternalLink}
            />
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
        <AddNewButton
          onClick={addNewExternalLink}
          label={t('stopDetails.externalLinks.addExternalLink')}
          testId={testIds.addExternalLink}
        />
      </form>
    </FormProvider>
  );
};

export const ExternalLinksForm = React.forwardRef(ExternalLinksFormComponent);
