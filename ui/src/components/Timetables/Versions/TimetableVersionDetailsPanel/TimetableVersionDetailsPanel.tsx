import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import {
  closeVersionPanelAction,
  selectTimetableVersionPanel,
  useAppSelector,
} from '../../../../redux';
import { SortOrder } from '../../../../types';
import {
  chainedComparator,
  comparePrimitive,
  getOrder,
  useCallbackOnKeyEscape,
} from '../../../../utils';
import { Visible } from '../../../common/LayoutComponents';
import { RouteTimetableCard } from './RouteTimetableCard';
import { TimetableVersionPanelHeading } from './TimetableVersionPanelHeading';
import {
  RouteTimetableRowInfo,
  useVehicleScheduleFrameSchedules,
} from './useVehicleScheduleFrameSchedules';

const reverse = getOrder<RouteTimetableRowInfo>(SortOrder.DESCENDING);

const rowInfoComparator = chainedComparator<RouteTimetableRowInfo>(
  reverse((a, b) => comparePrimitive(a.direction, b.direction)),
  (a, b) => comparePrimitive(a.label, b.label),
);

function sortRowInfo(
  rows: ReadonlyArray<RouteTimetableRowInfo>,
): Array<RouteTimetableRowInfo> {
  return rows.toSorted(rowInfoComparator);
}

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
    timetableRowInfo && sortRowInfo(timetableRowInfo);

  return (
    <Visible visible={isOpen}>
      <div
        role="dialog"
        className="fixed top-0 right-0 mt-20 mr-4 h-[90%] w-1/3 overflow-auto rounded-md bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-slate-500"
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
