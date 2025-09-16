import { FC, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { Column, Row } from '../../../../../../layoutComponents';
import { ElectricityFilter } from './ElectricityFilter';
import { ElyFilter } from './ElyFilter';
import { InfoSpotsFilter } from './InfoSpotsFilter';
import { MunicipalityFilter } from './MunicipalityFilter';
import { PriorityFilter } from './PriorityFilter';
import { ShelterFilter } from './ShelterFilter';
import { StopStateFilter } from './StopStateFilter';
import { TransportationModeFilter } from './TransportationModeFilter';

type PlaceHolderFilterProps = {
  readonly className?: string;
  readonly label: string;
};

const PlaceHolderFilter: FC<PlaceHolderFilterProps> = ({
  className,
  label,
}) => {
  const id = useId();

  return (
    <Column className={className}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" disabled />
    </Column>
  );
};

type StopPropertyFilterProps = {
  readonly className?: string;
  readonly notForStops: boolean;
};

// Generic filters: each filter should be 1/3 of the available space wide.
// -1rem for each gap between filters.
// When the screen is smaller than xl-size, we move the future sister element,
// <MetaFilters> from the right side below those filters. So between lx and lg,
// we can fit 4 filters side by side, but when the screen is again below lg in
// size, we switch to 3 column mode.
// In sm size, we can only fit 2 filters per row.

// Sizing of <TransportationModeFilter>, <PriorityFilter>, <MunicipalityFilter>:
// In sm size: Elements get reordered visually: Mode and Municipality on 1st row
// with width of 1/2, Prio on its own on the 2nd row with automatic size.
// In md size: we can only fit Mode and Prio filters side-by-side, Municipality
// will be wrapped down to the row below.
// In lg size: we can't properly fit 4 filters on the top row, so Mode and
// Municipality filters will respect the 1/4 size, but Priority will hog 2/4 of
// space for itself (right margin: auto)
// In +xl size: Mode 1/3 width, Prio auto width, Municipality gets minimized to
// the remaining size.

const smBasis = 'sm:basis-[calc((100%-1rem)/2)]'; // 2 cols, 1 gap
const mdBasis = 'md:basis-[calc((100%-2rem)/3)]'; // 3 cols, 2 gaps
const lgBasis = 'lg:basis-[calc((100%-3rem)/4)]'; // 4 cols, 3 gaps
const xlBasis = 'xl:basis-[calc((100%-2rem)/3)]'; // 3 cols, 2 gaps

const genericFilterSizing = twJoin(smBasis, mdBasis, lgBasis, xlBasis);

export const StopPropertyFilters: FC<StopPropertyFilterProps> = ({
  className,
  notForStops,
}) => {
  const { t } = useTranslation();

  return (
    <Row className={twMerge('flex-wrap justify-start gap-4', className)}>
      <TransportationModeFilter
        className={twJoin('sm:-order-2 md:order-none', genericFilterSizing)}
      />
      <PriorityFilter className="mr-auto" disabled={notForStops} />
      <MunicipalityFilter
        className={twJoin(
          'min-w-30 sm:-order-1 md:order-none xl:flex-grow xl:basis-auto',
          smBasis,
          mdBasis,
          lgBasis,
        )}
        disabled={notForStops}
      />

      <StopStateFilter className={genericFilterSizing} disabled={notForStops} />
      <ShelterFilter className={genericFilterSizing} disabled={notForStops} />
      <ElectricityFilter
        className={genericFilterSizing}
        disabled={notForStops}
      />

      <InfoSpotsFilter className={genericFilterSizing} disabled={notForStops} />
      <ElyFilter className={genericFilterSizing} disabled={notForStops} />
    </Row>
  );
};
