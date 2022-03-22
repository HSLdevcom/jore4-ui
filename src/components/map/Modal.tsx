import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../layoutComponents';
import { CloseIconButton, SimpleButton } from '../../uiComponents';

const HeaderFooterContainer: FunctionComponent = ({ children }) => {
  return (
    <div className="border border-light-grey bg-background px-14 py-7">
      {children}
    </div>
  );
};

interface HeaderProps {
  onClose: () => void;
  heading: string;
}

const ModalHeader = ({ onClose, heading }: HeaderProps): JSX.Element => {
  return (
    <HeaderFooterContainer>
      <Row>
        <p className="text-2xl font-bold">{heading}</p>
        <CloseIconButton className="ml-auto" onClick={onClose} />
      </Row>
    </HeaderFooterContainer>
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
        <SimpleButton className="ml-auto" onClick={onCancel} inverted>
          {t('cancel')}
        </SimpleButton>
        <SimpleButton onClick={onSave}>{t('save')}</SimpleButton>
      </Row>
    </HeaderFooterContainer>
  );
};

interface Props {
  heading: string;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const Modal: FunctionComponent<Props> = ({
  heading,
  onClose,
  onCancel,
  onSave,
  children,
}) => {
  return (
    <div className="overflow-auto bg-white">
      <ModalHeader onClose={onClose} heading={heading} />
      {children}
      <ModalFooter onCancel={onCancel} onSave={onSave} />
    </div>
  );
};
