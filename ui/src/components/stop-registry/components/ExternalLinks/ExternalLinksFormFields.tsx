import { t } from 'i18next';
import React from 'react';
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

type Props = {
  readonly index: number;
  readonly onRemove: (index: number) => void;
};

export const ExternalLinksFormFields: React.FC<Props> = ({
  index,
  onRemove,
}) => {
  const { register, watch } = useFormContext<ExternalLinksFormState>();
  const toBeDeleted = watch(`externalLinks.${index}.toBeDeleted`);

  return (
    <Column className="space-y-4">
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
        <InputField<ExternalLinksFormState>
          type="string"
          translationPrefix="stopDetails"
          fieldPath={`externalLinks.${index}.name`}
          inputClassName="w-100"
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
              <i className="icon-restore -ml-2.5 text-2xs" aria-hidden="true" />
            </>
          ) : (
            <>
              <span className="sr-only">
                {t('stopDetails.externalLinks.deleteExternalLink')}
              </span>
              <i className="icon-trash text-lg" aria-hidden="true" />
            </>
          )}
        </SlimSimpleButton>
      </Row>
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
        <InputField<ExternalLinksFormState>
          type="string"
          translationPrefix="stopDetails"
          fieldPath={`externalLinks.${index}.location`}
          inputClassName="w-100"
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
