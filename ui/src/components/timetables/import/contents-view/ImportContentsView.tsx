import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleScheduleFrameWithRouteInfoFragment } from '../../../../generated/graphql';
import { VehicleScheduleFrameBlocksView } from './VehicleScheduleFrameBlocksView';

type ImportContentsViewProps = {
  readonly vehicleScheduleFrames: ReadonlyArray<VehicleScheduleFrameWithRouteInfoFragment>;
};

export const ImportContentsView: FC<ImportContentsViewProps> = ({
  vehicleScheduleFrames,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h2>{t('timetablesPreview.fileContent')}</h2>
      {vehicleScheduleFrames.map((frame) => (
        <VehicleScheduleFrameBlocksView
          key={frame.vehicle_schedule_frame_id}
          vehicleScheduleFrame={frame}
        />
      ))}
    </div>
  );
};
