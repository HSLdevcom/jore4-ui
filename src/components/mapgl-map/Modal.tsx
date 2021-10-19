import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';

const HeaderFooterContainer: FunctionComponent = ({ children }) => {
  // There seems to some kind of bug that causes VSCode's
  // `esbenp.prettier-vscode` plugin to arrange these classnames
  // in different order than prettier CLI, which causes problems in CI.
  // As a workaround define classnames in custon string which
  // `prettier-plugin-tailwind` does not format
  const classNames = 'px-14 py-7 bg-background border border-light-grey';
  return <div className={classNames}>{children}</div>;
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
        <button className="ml-auto" type="button" onClick={onClose}>
          <i className="icon-close-large ml-4 text-lg" />
        </button>
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
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const Modal: FunctionComponent<Props> = ({
  onClose,
  onCancel,
  onSave,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white">
      <ModalHeader
        onClose={onClose}
        heading={t('stops.stopById', { id: 'xxxxx' })}
      />
      {children}
      <ModalFooter onCancel={onCancel} onSave={onSave} />
    </div>
  );
};
