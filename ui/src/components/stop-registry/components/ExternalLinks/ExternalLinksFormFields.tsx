import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Column, Row } from '../../../../layoutComponents';
import { InputField } from '../../../forms/common';
import { SlimSimpleButton } from '../../stops/stop-details/layout';
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
          className="min-w-0 flex-grow"
          inputClassName="w-full"
          testId={testIds.name}
          disabled={toBeDeleted}
        />
        <SlimSimpleButton
          testId={testIds.deleteExternalLink}
          onClick={() => onRemove(index)}
          inverted
          className="m-0 h-11 w-11 rounded-full p-0"
        >
          {toBeDeleted ? (
            <>
              <span className="sr-only">
                {t('stopDetails.externalLinks.cancelDeleteExternalLink')}
              </span>
              <i className="icon-restore -ml-2.5 text-2xs" aria-hidden />
            </>
          ) : (
            <>
              <span className="sr-only">
                {t('stopDetails.externalLinks.deleteExternalLink')}
              </span>
              <i className="icon-trash text-lg" aria-hidden />
            </>
          )}
        </SlimSimpleButton>
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
