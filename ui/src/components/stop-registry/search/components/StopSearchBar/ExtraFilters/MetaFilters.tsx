import { FC } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { Row } from '../../../../../../layoutComponents';
import { StopOwnerFilter } from './StopOwnerFilter';
import { lgBasis, mdBasis, smBasis } from './StopPropertyFilters';

type MetaFilterProps = {
  readonly className?: string;
  readonly notForStops: boolean;
};

const xlBasis = 'xl:basis-[calc((100%-2rem)/1)]'; // 1 col
const genericFilterSizing = twJoin(smBasis, mdBasis, lgBasis, xlBasis);

export const MetaFilters: FC<MetaFilterProps> = ({
  className,
  notForStops,
}) => {
  return (
    <Row
      className={twMerge('self-start xl:border-b xl:pb-4 xl:pl-4', className)}
    >
      <StopOwnerFilter className={genericFilterSizing} disabled={notForStops} />
    </Row>
  );
};
