import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Column, Row } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { InputField } from '../../../forms/common';
import { ExternalLinksFormState } from './schema';

const testIds = {
  name: 'ExternalLinksFormFields::name',
  location: 'ExternalLinksFormFields::location',
  deleteExternalLink: 'ExternalLinksFormFields::deleteExternalLink',
};

type ExternalLinksFormFieldsProps = {
  readonly index: number;
  readonly onRemove: (index: number) => void;
  readonly toBeDeleted: boolean;
};

export const ExternalLinksFormFields: FC<ExternalLinksFormFieldsProps> = ({
  index,
  onRemove,
  toBeDeleted,
}) => {
  const { register } = useFormContext<ExternalLinksFormState>();

  return (
    <Column className="w-full space-y-4">
      <Row className="flex w-full items-end gap-4">
        <InputField<ExternalLinksFormState>
          type="string"
          translationPrefix="stopDetails"
          fieldPath={`externalLinks.${index}.name`}
          className="min-w-0 grow"
          inputClassName="w-full"
          testId={testIds.name}
          disabled={toBeDeleted}
        />
        <SimpleButton
          shape="round"
          testId={testIds.deleteExternalLink}
          onClick={() => onRemove(index)}
          inverted
          tooltip={
            toBeDeleted
              ? t('stopDetails.externalLinks.cancelDeleteExternalLink')
              : t('stopDetails.externalLinks.deleteExternalLink')
          }
          className="h-11"
        >
          {toBeDeleted ? (
            <i className="icon-restore -ml-2.5 text-2xs" aria-hidden />
          ) : (
            <i className="icon-trash text-lg" aria-hidden />
          )}
        </SimpleButton>
      </Row>
      <Row className="flex w-full items-end">
        <InputField<ExternalLinksFormState>
          type="url"
          translationPrefix="stopDetails"
          fieldPath={`externalLinks.${index}.location`}
          className="w-full"
          inputClassName="w-full"
          testId={testIds.location}
          disabled={toBeDeleted}
        />
      </Row>
      <input
        type="checkbox"
        hidden
        {...register(`externalLinks.${index}.toBeDeleted`)}
      />
    </Column>
  );
};
