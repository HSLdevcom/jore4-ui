import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIconButton } from '../Buttons';
import { Row } from '../LayoutComponents';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

type ModalHeaderProps = {
  readonly onClose: () => void;
  readonly heading: string;
  readonly titleTestId?: string;
};

export const ModalHeader: FC<ModalHeaderProps> = ({
  onClose,
  heading,
  titleTestId,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="border border-light-grey bg-background px-10 py-7">
      <h2 data-testid={titleTestId}>{heading}</h2>
      <CloseIconButton
        ariaLabel={t(($) => $.close)}
        className="ml-auto"
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
