import { FunctionComponent } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../layoutComponents';

const testIds = {
  modalFooter: 'ModalFooter',
};

interface Props {
  className?: string;
}

export const NewModalFooter: FunctionComponent<Props> = ({
  children,
  className,
}) => {
  return (
    <Row
      testId={testIds.modalFooter}
      className={twMerge(
        'justify-end space-x-1 border border-light-grey bg-background py-4 px-5',
        className,
      )}
    >
      {children}
    </Row>
  );
};
