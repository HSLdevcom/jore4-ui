import { gql } from '@apollo/client';
import { useGetTimetablesForCalendarDayQuery } from '../../generated/graphql';

// TODO: we should query timetables based on line_id and
// perhaps also priority, but right now we have
// only mock seed data available and no UI for selecting line
// so this query just fetches all available data
const GQL_GET_TIMETABLES_FOR_CALENDAR_DAY = gql`
  query GetTimetablesForCalendarDay {
    timetables {
      timetables_service_calendar_day_type {
        vehicle_services {
          blocks {
            vehicle_journeys {
              timetabled_passing_times {
                arrival_time
                departure_time
                timetabled_passing_time_id
              }
              vehicle_journey_id
            }
            block_id
          }
          day_type_id
          day_type {
            label
            day_type_id
          }
          vehicle_service_id
        }
        label
        day_type_id
      }
    }
  }
`;

export const useGetTimetables = () => {
  const timetablesResponse = useGetTimetablesForCalendarDayQuery();
  const timetables = timetablesResponse.data?.timetables;

  return {
    timetables,
  };
};
