import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { IconButton } from '../../../../uiComponents';
import {
  VehicleScheduleFrameInfo,
  useMissingRouteDeviationsSort,
} from '../hooks';
import { RouteDeviationLink } from './RouteDeviationLink';

type MissingRouteDeviationsSectionProps = {
  readonly className?: string;
  readonly routeDeviations: ReadonlyArray<VehicleScheduleFrameInfo>;
  readonly handleClose: () => void;
};

export const MissingRouteDeviationsSection: FC<
  MissingRouteDeviationsSectionProps
> = ({ className, routeDeviations, handleClose }) => {
  const { t } = useTranslation();
  const { sortDeviations } = useMissingRouteDeviationsSort();

  const sortedDeviations = sortDeviations(routeDeviations);

  return (
    <div className={className}>
      <div className="relative mt-8 flex flex-row space-x-4 rounded-lg border border-hsl-highlight-yellow-dark bg-hsl-highlight-yellow-light p-6">
        <div>
          <p>
            {t('timetablesPreview.missingRouteDeviations.deviationsWarning')}
          </p>
          <div className="flex flex-row">
            {t('timetablesPreview.missingRoutes')}
            {sortedDeviations.map((deviation, index, { length }) => (
              <RouteDeviationLink
                key={deviation.routeId}
                deviation={deviation}
                isLast={length - 1 === index}
                testIdPrefix={`RouteDeviationLink::${index}`}
              />
            ))}
          </div>
          <IconButton
            className="absolute top-4 right-4 text-xl"
            icon={<MdClose aria-hidden />}
            onClick={handleClose}
            tooltip={`${t(
              'accessibility:timetables.closeMissingRouteDeviationsWarning',
            )}`}
          />
        </div>
      </div>
    </div>
  );
};
