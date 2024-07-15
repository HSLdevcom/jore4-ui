import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../layoutComponents';

const testIds = {
  modalFooter: 'ModalFooter',
};

interface Props {
  className?: string;
  children: ReactNode;
}

export const NewModalFooter: FC<Props> = ({ children, className = '' }) => {
  return (
    <Row
      testId={testIds.modalFooter}
      className={twMerge(
        'justify-end space-x-1 border border-light-grey bg-background px-5 py-4',
        className,
      )}
    >
      {children}
    </Row>
  );
};
