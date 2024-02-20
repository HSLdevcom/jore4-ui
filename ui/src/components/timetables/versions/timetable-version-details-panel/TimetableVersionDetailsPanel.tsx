import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  useAppSelector,
  useVehicleScheduleFrameSchedules,
} from '../../../../hooks';
import { Visible } from '../../../../layoutComponents';
import {
  closeVersionPanelAction,
  selectTimetableVersionPanel,
} from '../../../../redux';
import { RouteTimetableCard } from './RouteTimetableCard';
import { TimetableVersionPanelHeading } from './TimetableVersionPanelHeading';

export const TimetableVersionDetailsPanel = () => {
  const { isOpen, vehicleScheduleFrameId } = useAppSelector(
    selectTimetableVersionPanel,
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const { timetableRowInfo, dayType, createdAt, validityStart, validityEnd } =
    useVehicleScheduleFrameSchedules(vehicleScheduleFrameId);

  const onClose = () => {
    dispatch(closeVersionPanelAction());
  };

  // Close the panel in case we navigate elsewhere
  useEffect(() => {
    return () => {
      dispatch(closeVersionPanelAction());
    };
  }, [dispatch, location.pathname]);

  // Sort reverse alphabetically, so that 'outbound' (1) gets sorted as first.
  const sortedByDirectionRouteTimetableRowInfo =
    timetableRowInfo &&
    timetableRowInfo
      .sort((a, b) => b.direction.localeCompare(a.direction))
      .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Visible visible={isOpen}>
      <div className="fixed top-0 right-0 mt-20 mr-4 h-[90%] w-1/3 overflow-scroll rounded-md bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-slate-500">
        <TimetableVersionPanelHeading
          validityStart={validityStart}
          validityEnd={validityEnd}
          onClose={onClose}
        />
        {sortedByDirectionRouteTimetableRowInfo?.map((rowInfo) => {
          return (
            <RouteTimetableCard
              key={`${rowInfo.label}.${rowInfo.direction}`}
              routeTimetableRowInfo={rowInfo}
              dayTypeNameI18n={dayType?.name_i18n}
              createdAt={createdAt}
            />
          );
        })}
      </div>
    </Visible>
  );
};
