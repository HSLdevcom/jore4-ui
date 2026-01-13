import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { doOnEscape } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import {
  NavigationContext,
  useWrapInContextNavigation,
} from '../../forms/common/NavigationBlocker';
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
      <Row className="justify-end gap-2">
        <SimpleButton onClick={onCancel} inverted>
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
  readonly onCancel?: () => void;
  readonly onSave?: () => void;
  readonly children: ReactNode;
  readonly navigationContext: NavigationContext;
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
  navigationContext,
}) => {
  const wrapInContextNavigation = useWrapInContextNavigation(navigationContext);
  const requestNavigationOnClose = wrapInContextNavigation(onClose);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      data-testid={testId}
      className={twMerge('overflow-hidden bg-white', className)}
      onKeyDown={doOnEscape(requestNavigationOnClose)}
    >
      <ModalHeader
        className={headerClassName}
        onClose={requestNavigationOnClose}
        heading={heading}
      />
      <ModalBody className={twMerge('overflow-auto', bodyClassName)}>
        {children}
      </ModalBody>
      {onCancel && onSave && (
        <ModalFooter
          className={footerClassName}
          onCancel={onCancel}
          onSave={onSave}
        />
      )}
    </div>
  );
};
