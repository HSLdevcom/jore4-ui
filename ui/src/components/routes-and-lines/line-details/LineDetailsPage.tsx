import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { Navigate, useSearchParams } from 'react-router';
import { useResolveLineIdByLabelQuery } from '../../../generated/graphql';
import { useRequiredParams } from '../../../hooks';
import { Path, routeDetails } from '../../../router/routeDetails';
import { parseDate } from '../../../time';
import { LineDetailsByIdPage } from './LineDetailsByIdPage';

const uuidLength = 36;

const GQL_RESOLVE_LINE_ID_BY_LABEL = gql`
  query ResolveLineIdByLabel($label: String!, $observationDate: date!) {
    route_line(
      where: {
        label: { _ilike: $label }
        validity_start: { _lte: $observationDate }
        priority: { _lt: 30 }
        _or: [
          { validity_end: { _gte: $observationDate } }
          { validity_end: { _is_null: true } }
        ]
      }
      order_by: [{ priority: desc }]
      limit: 1
    ) {
      line_id
    }
  }
`;

const RedirectToLineDetailsByIdPageByLabel: FC<{
  readonly label: string;
}> = ({ label }) => {
  const [searchParams] = useSearchParams();
  const observationDate =
    parseDate(searchParams.get('observationDate')) ??
    DateTime.now().startOf('day');

  const { data, loading } = useResolveLineIdByLabelQuery({
    variables: { label, observationDate },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return null;
  }

  const id = data?.route_line.at(0)?.line_id;
  if (id?.length === 36) {
    return <Navigate to={routeDetails[Path.lineDetails].getLink(id)} replace />;
  }

  return <Navigate to="/404" replace />;
};

export const LineDetailsPage: FC = () => {
  const { id } = useRequiredParams<{ id: string }>();

  // If the ID has proper length, assume it is a UUID and render the existing
  // page, that shows the line details based in the ID in the URL.
  if (id.length === uuidLength) {
    return <LineDetailsByIdPage />;
  }

  // Else, assume that the string in the URL is the label of the line.
  // Find out the proper ID for the active version as per observationDate,
  // and then replace the URL with one that has the UUID ID in the url,
  // thus triggering the above code path to the actual implementation.
  // The above page should likely be recoded to fetch the line details by
  // the label, not by the id.
  return <RedirectToLineDetailsByIdPageByLabel label={id} />;
};
