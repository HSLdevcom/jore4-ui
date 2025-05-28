import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import {
  useAppSelector,
  useCallbackOnKeyEscape,
  useVehicleScheduleFrameSchedules,
} from '../../../../hooks';
import { Visible } from '../../../../layoutComponents';
import {
  closeVersionPanelAction,
  selectTimetableVersionPanel,
} from '../../../../redux';
import {
  sortAlphabetically,
  sortReverseAlphabetically,
} from '../../../../utils';
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

  useCallbackOnKeyEscape(onClose);

  // Close the panel in case we navigate elsewhere
  useEffect(() => {
    return () => {
      dispatch(closeVersionPanelAction());
    };
  }, [dispatch, location.pathname]);

  const sortedByDirectionRouteTimetableRowInfo =
    timetableRowInfo &&
    sortAlphabetically(
      sortReverseAlphabetically(timetableRowInfo, 'direction'),
      'label',
    );

  return (
    <Visible visible={isOpen}>
      <div
        role="dialog"
        className="fixed right-0 top-0 mr-4 mt-20 h-[90%] w-1/3 overflow-auto rounded-md bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-slate-500"
      >
        <TimetableVersionPanelHeading
          validityStart={validityStart}
          validityEnd={validityEnd}
          onClose={onClose}
        />
        {sortedByDirectionRouteTimetableRowInfo?.map((rowInfo) => (
          <RouteTimetableCard
            key={`${rowInfo.label}.${rowInfo.direction}`}
            routeTimetableRowInfo={rowInfo}
            dayTypeNameI18n={dayType?.name_i18n}
            createdAt={createdAt}
          />
        ))}
      </div>
    </Visible>
  );
};
