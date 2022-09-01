import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';
import { ModalHeader } from '../modal';

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
  return (
    <div data-testid={testId} className="overflow-auto bg-white">
      <ModalHeader onClose={onClose} heading={heading} />
      {children}
      <ModalFooter onCancel={onCancel} onSave={onSave} />
    </div>
  );
};
