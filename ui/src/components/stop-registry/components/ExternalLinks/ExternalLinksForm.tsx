import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  ExternalLinksDetailsFragment,
  TerminalExternalLinksDetailsFragment,
} from '../../../../generated/graphql';
import {
  HorizontalSeparator,
  Row,
  Visible,
} from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { AddNewButton } from '../../../../uiComponents/AddNewButton';
import { useDirtyFormBlockNavigation } from '../../../forms/common/NavigationBlocker';
import { ExternalLinksFormFields } from './ExternalLinksFormFields';
import {
  ExternalLinksFormState,
  externalLinksFormSchema,
  mapExternalLinkDataToFormState,
} from './schema';

const testIds = {
  externalLink: 'ExternalLinksForm::externalLink',
  addExternalLink: 'ExternalLinksForm::addExternalLink',
  deleteExternalLink: 'ExternalLinksForm::deleteExternalLink',
  saveButton: 'ExternalLinks::saveButton',
  cancelButton: 'ExternalLinks::cancelButton',
};

type ExternalLinksFormProps = {
  readonly className?: string;
  readonly externalLinks: ReadonlyArray<
    ExternalLinksDetailsFragment | TerminalExternalLinksDetailsFragment
  >;
  readonly setIsEditing: (isEditing: boolean) => void;
  readonly onSubmit: (state: ExternalLinksFormState) => void;
};

export const ExternalLinksForm: FC<ExternalLinksFormProps> = ({
  className,
  externalLinks,
  setIsEditing,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const defaultValues: ExternalLinksFormState = {
    externalLinks: externalLinks?.length
      ? externalLinks.map(mapExternalLinkDataToFormState)
      : [mapExternalLinkDataToFormState({})],
  };

  const methods = useForm<ExternalLinksFormState>({
    defaultValues,
    resolver: zodResolver(externalLinksFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'ExternalLinksForm');
  const { control, setValue, getValues, handleSubmit, watch } = methods;

  const {
    append,
    fields: externalLinksFields,
    remove,
  } = useFieldArray({
    control,
    name: 'externalLinks',
  });

  const addNewExternalLink = useCallback(() => {
    append(mapExternalLinkDataToFormState({}));
  }, [append]);

  const onRemoveExternalLink = (idx: number) => {
    if (idx >= externalLinks.length) {
      remove(idx);
    } else {
      const newToBeDeleted = !getValues(`externalLinks.${idx}.toBeDeleted`);
      setValue(`externalLinks.${idx}.toBeDeleted`, newToBeDeleted, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = (state: ExternalLinksFormState) => {
    onSubmit(state);
    setIsEditing(false);
  };

  const isLast = (idx: number) => idx === externalLinksFields.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-4', className)}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {externalLinksFields.map((externalLink, idx) => (
          <div key={externalLink.orderNum} data-testid={testIds.externalLink}>
            <ExternalLinksFormFields
              index={idx}
              onRemove={onRemoveExternalLink}
              toBeDeleted={watch(`externalLinks.${idx}.toBeDeleted`)}
            />
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
        <Row className="mt-4 justify-between gap-2">
          <AddNewButton
            onClick={addNewExternalLink}
            label={t('stopDetails.externalLinks.addExternalLink')}
            testId={testIds.addExternalLink}
          />
          <div className="flex gap-2">
            <SimpleButton
              testId={testIds.cancelButton}
              onClick={handleCancel}
              inverted
            >
              {t('cancel')}
            </SimpleButton>
            <SimpleButton testId={testIds.saveButton} type="submit">
              {t('save')}
            </SimpleButton>
          </div>
        </Row>
      </form>
    </FormProvider>
  );
};
