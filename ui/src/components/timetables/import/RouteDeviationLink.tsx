import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { VehicleScheduleFrameInfo } from '../../../hooks/vehicle-schedule-frame/useVehicleScheduleFramesToVehicleScheduleFrameInfo';
import { parseI18nField } from '../../../i18n/utils';
import { routeDetails } from '../../../router/routeDetails';
import { DirectionBadge } from '../../routes-and-lines/line-details/DirectionBadge';

interface Props {
  deviation: VehicleScheduleFrameInfo;
  index: number;
  testId: string;
}
export const RouteDeviationLink = ({ deviation, index, testId }: Props) => {
  const { t } = useTranslation();
  const { lineId, label, direction, variant } = deviation;
  return (
    <Link
      to={routeDetails['/lines/:id'].getLink(lineId, label)}
      title={parseI18nField(deviation.routeName)}
      data-testid={testId}
    >
      <div className="flex items-center">
        {!!index && ', '}
        <DirectionBadge
          direction={direction}
          titleName={t(`directionEnum.${direction}`)}
          className="mx-1 !h-4 !w-4 text-sm"
        />
        <span className="mr-1 font-bold text-black underline">{label}</span>
        {variant && <span>{variant}</span>}
      </div>
    </Link>
  );
};
