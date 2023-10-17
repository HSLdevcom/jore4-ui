import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { useDeviationSort } from '../../../hooks/timetables-import/useDeviationSort';
import { VehicleScheduleFrameInfo } from '../../../hooks/vehicle-schedule-frame/useVehicleScheduleFramesToVehicleScheduleFrameInfo';
import { RouteDeviationLink } from './RouteDeviationLink';

export const DeviationSection = ({
  className = '',
  routeDeviations,
}: {
  className?: string;
  routeDeviations: VehicleScheduleFrameInfo[];
}) => {
  const { t } = useTranslation();
  const { sortDeviations } = useDeviationSort();

  const sortedDeviations = sortDeviations(routeDeviations);

  return (
    <div className={className}>
      <h3>
        <MdWarning className="mr-2 inline text-hsl-red" />
        {t('timetablesPreview.deviations', { count: routeDeviations.length })}
      </h3>
      <div className="mt-8 rounded-lg border bg-hsl-highlight-yellow-light px-12 py-6">
        <MdWarning className="mr-2 inline text-hsl-red" />
        {t('timetablesPreview.deviationsText')}
        <div className="flex">
          {sortedDeviations.map((deviation, index) => (
            <RouteDeviationLink
              key={deviation.routeId}
              deviation={deviation}
              index={index}
              testId={`RouteDeviationLink::${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
