import { useParams } from 'react-router-dom';
import { useGetLinesByLabelAndPriorityQuery } from '../../generated/graphql';
import { mapLinesByLabelAndPriorityResult } from '../../graphql';
import { Priority } from '../../types/Priority';
import { mapToVariables } from '../../utils';

export const useGetLineDraftDetails = () => {
  const { label } = useParams<{ label: string }>();

  const lineDetailsResult = useGetLinesByLabelAndPriorityQuery(
    mapToVariables({ label, priority: Priority.Draft }),
  );

  const lines = mapLinesByLabelAndPriorityResult(lineDetailsResult);

  return { lines };
};
