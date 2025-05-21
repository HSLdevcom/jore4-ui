import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from '../../../layoutComponents';
import { TerminalTitleRow } from './components/TerminalTitleRow';
import { TerminalVersioningRow } from './components/TerminalVersioningRow';
import { useGetParentStopPlaceDetails } from './useGetTerminalDetails';
import { TerminalDetails } from './components/TerminalDetails';

const testIds = {
  page: 'TerminalDetailsPage::page',
};

export const TerminalDetailsPage: FC<Record<string, never>> = () => {
  const { parentStopPlaceDetails } = useGetParentStopPlaceDetails();

  if (!parentStopPlaceDetails) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Container className="space-y-4" testId={testIds.page}>
      <TerminalTitleRow terminal={parentStopPlaceDetails} />
      <hr />
      <TerminalVersioningRow terminal={parentStopPlaceDetails} />
      <TerminalDetails terminal={parentStopPlaceDetails} />
    </Container>
  );
};
