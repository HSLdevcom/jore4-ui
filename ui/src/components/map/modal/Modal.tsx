import { FC, PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useCallbackOnKeyEscape } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ModalBody } from './ModalBody';
import { ModalHeader } from './ModalHeader';

const testIds = {
  saveButton: 'Modal::saveButton',
};

const HeaderFooterContainer: FC<PropsWithChildren> = ({ children }) => {
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

const ModalFooter = ({ onCancel, onSave }: FooterProps): React.ReactElement => {
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
  children: ReactNode;
}

export const Modal: FC<Props> = ({
  testId,
  heading,
  onClose,
  onCancel,
  onSave,
  children,
}) => {
  useCallbackOnKeyEscape(onClose);

  return (
    <div data-testid={testId} className="overflow-auto bg-white">
      <ModalHeader onClose={onClose} heading={heading} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter onCancel={onCancel} onSave={onSave} />
    </div>
  );
};
