import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { CloseIconButton } from '../../common/Buttons';
import { Row } from '../../common/LayoutComponents';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

type ModalHeaderProps = {
  readonly className?: string;
  readonly onClose: () => void;
  readonly heading: ReactNode;
};

export const ModalHeader: FC<ModalHeaderProps> = ({
  className,
  onClose,
  heading,
}) => {
  const { t } = useTranslation();

  return (
    <Row
      className={twMerge(
        'border border-light-grey bg-background px-10 py-7',
        className,
      )}
    >
      <h2>{heading}</h2>
      <CloseIconButton
        ariaLabel={t(($) => $.close)}
        className="ml-auto"
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
