import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopFormState as FormState, StopForm } from '../../forms/stop';
import { CustomOverlay } from '../CustomOverlay';
import { Modal } from '../modal';
import { CreateChanges, EditChanges } from './hooks';

const testIds = {
  modal: 'EditStopModal',
};

type EditStopModalProps = {
  readonly defaultValues: Partial<FormState>;
  readonly editing: boolean;
  readonly onCancel: () => void;
  readonly onClose: () => void;
  readonly onSubmit: (changes: CreateChanges | EditChanges) => void;
};

export const EditStopModal: FC<EditStopModalProps> = ({
  defaultValues,
  editing,
  onCancel,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const formRef = useRef<ExplicitAny>(null);

  const buildHeading = () => {
    const { publicCode: { value: label } = {} } = defaultValues;
    return label
      ? t('stops.stopWithLabel', { stopLabel: label })
      : t('stops.createStop');
  };

  /**
   * No sure how or why, but container min-h-full + modal max-h-full + grid
   * stuff in global.css is the magic combo that makes stuff size corrently
   */

  return (
    <CustomOverlay
      className="min-h-full w-[calc(450px+(2*1.25rem))]"
      position="top-left"
    >
      <Modal
        className="pointer-events-auto flex max-h-full flex-col"
        headerClassName="*:text-xl px-4 py-4 items-center"
        bodyClassName="mx-0 my-0 flex flex-col"
        testId={testIds.modal}
        onClose={onClose}
        heading={buildHeading()}
        navigationContext="StopForm"
      >
        <StopForm
          defaultValues={defaultValues}
          editing={editing}
          onSubmit={onSubmit}
          onCancel={onCancel}
          testIdPrefix={testIds.modal}
          ref={formRef}
          className="min-h-0"
        />
      </Modal>
    </CustomOverlay>
  );
};
