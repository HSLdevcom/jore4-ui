import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../../layoutComponents';
import { StopOwnerFilter } from './StopOwnerFilter';

type MetaFilterProps = {
  readonly className?: string;
  readonly notForStops: boolean;
};

export const MetaFilters: FC<MetaFilterProps> = ({
  className,
  notForStops,
}) => {
  return (
    <Row
      className={twMerge('self-start xl:border-b xl:pb-4 xl:pl-4', className)}
    >
      <StopOwnerFilter className="w-full" disabled={notForStops} />
    </Row>
  );
};
