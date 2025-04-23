import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useCallbackOnKeyEscape } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ModalBody } from './ModalBody';
import { ModalHeader } from './ModalHeader';

const testIds = {
  saveButton: 'Modal::saveButton',
};

type ModalFooterProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

const ModalFooter: FC<ModalFooterProps> = ({
  className,
  onCancel,
  onSave,
}: ModalFooterProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={twMerge(
        'border border-light-grey bg-background px-14 py-7',
        className,
      )}
    >
      <Row className="space-x-2">
        <SimpleButton containerClassName="ml-auto" onClick={onCancel} inverted>
          {t('cancel')}
        </SimpleButton>
        <SimpleButton testId={testIds.saveButton} onClick={onSave}>
          {t('save')}
        </SimpleButton>
      </Row>
    </div>
  );
};

type ModalProps = {
  readonly className?: string;
  readonly headerClassName?: string;
  readonly bodyClassName?: string;
  readonly footerClassName?: string;
  readonly testId?: string;
  readonly heading: ReactNode;
  readonly onClose: () => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
  readonly children: ReactNode;
};

export const Modal: FC<ModalProps> = ({
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  testId,
  heading,
  onClose,
  onCancel,
  onSave,
  children,
}) => {
  useCallbackOnKeyEscape(onClose);

  return (
    <div
      data-testid={testId}
      className={twMerge('overflow-hidden bg-white', className)}
    >
      <ModalHeader
        className={headerClassName}
        onClose={onClose}
        heading={heading}
      />
      <ModalBody className={twMerge('overflow-auto', bodyClassName)}>
        {children}
      </ModalBody>
      <ModalFooter
        className={footerClassName}
        onCancel={onCancel}
        onSave={onSave}
      />
    </div>
  );
};
