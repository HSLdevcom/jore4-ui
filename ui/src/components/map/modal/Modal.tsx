import { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ModalBody } from './ModalBody';
import { ModalHeader } from './ModalHeader';

const testIds = {
  saveButton: 'Modal::saveButton',
};

const HeaderFooterContainer: FunctionComponent = ({ children }) => {
  return (
    <div className="border border-light-grey bg-background px-14 py-7">
      {children}
    </div>
  );
};

interface FooterProps {
  onCancel: () => void;
  onSave: () => void;
}

const ModalFooter = ({ onCancel, onSave }: FooterProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <HeaderFooterContainer>
      <Row className="space-x-4">
        <SimpleButton containerClassName="ml-auto" onClick={onCancel} inverted>
          {t('cancel')}
        </SimpleButton>
        <SimpleButton testId={testIds.saveButton} onClick={onSave}>
          {t('save')}
        </SimpleButton>
      </Row>
    </HeaderFooterContainer>
  );
};

interface Props {
  testId?: string;
  heading: string;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const Modal: FunctionComponent<Props> = ({
  testId,
  heading,
  onClose,
  onCancel,
  onSave,
  children,
}) => {
  const closeOnEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', closeOnEscape, true);
    return () => document.removeEventListener('keydown', closeOnEscape, true);
  });

  return (
    <div data-testid={testId} className="overflow-auto bg-white">
      <ModalHeader onClose={onClose} heading={heading} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter onCancel={onCancel} onSave={onSave} />
    </div>
  );
};