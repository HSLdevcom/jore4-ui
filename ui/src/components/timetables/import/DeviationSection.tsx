import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { VehicleScheduleFrameInfo } from '../../../hooks/timetables-import/deviations/useCreateVehicleScheduleFrameInfo';
import { useDeviationSort } from '../../../hooks/timetables-import/deviations/useDeviationSort';
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
        <MdWarning className="mr-2 inline text-hsl-red" role="img" />
        {t('timetablesPreview.deviations', { count: routeDeviations.length })}
      </h3>
      <div className="mt-8 rounded-lg border bg-hsl-highlight-yellow-light px-12 py-6">
        <MdWarning className="mr-2 inline text-hsl-red" role="img" />
        {t('timetablesPreview.deviationsWarning')}
        <div className="flex">
          {sortedDeviations.map((deviation, index, { length }) => (
            <RouteDeviationLink
              key={deviation.routeId}
              deviation={deviation}
              isLast={length - 1 === index}
              testIdPrefix={`RouteDeviationLink::${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
