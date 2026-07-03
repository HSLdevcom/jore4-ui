import { DialogTitle } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { CloseIconButton } from '../Buttons';
import { Row } from '../LayoutComponents';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

type NewModalHeaderProps = {
  readonly onClose: () => void;
  readonly heading: string;
  readonly className?: string;
};

export const NewModalHeader: FC<NewModalHeaderProps> = ({
  onClose,
  heading,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Row
      className={twMerge(
        'flex justify-between border border-light-grey bg-background px-5 py-4',
        className,
      )}
    >
      <DialogTitle>{heading}</DialogTitle>
      <CloseIconButton
        ariaLabel={t(($) => $.close)}
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
