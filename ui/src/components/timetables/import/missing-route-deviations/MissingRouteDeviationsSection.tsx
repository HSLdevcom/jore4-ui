import { useTranslation } from 'react-i18next';
import { MdClose, MdWarning } from 'react-icons/md';
import {
  VehicleScheduleFrameInfo,
  useMissingRouteDeviationsSort,
} from '../../../../hooks';
import { IconButton } from '../../../../uiComponents';
import { RouteDeviationLink } from './RouteDeviationLink';

export const MissingRouteDeviationsSection = ({
  className = '',
  routeDeviations,
  handleClose,
}: {
  className?: string;
  routeDeviations: VehicleScheduleFrameInfo[];
  handleClose: () => void;
}) => {
  const { t } = useTranslation();
  const { sortDeviations } = useMissingRouteDeviationsSort();

  const sortedDeviations = sortDeviations(routeDeviations);

  return (
    <div className={className}>
      <h3>
        <MdWarning
          className="mr-2 inline h-6 w-6 text-hsl-red"
          role="img"
          title={t('timetablesPreview.attention')}
        />
        {t('timetablesPreview.deviations', { count: routeDeviations.length })}
      </h3>
      <div className="relative mt-8 flex flex-row space-x-4 rounded-lg border border-hsl-highlight-yellow-dark bg-hsl-highlight-yellow-light p-6">
        <MdWarning
          className="mr-2 inline h-6 w-6 text-hsl-red"
          role="img"
          title={t('timetablesPreview.attention')}
        />
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
            icon={<MdClose />}
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
};
