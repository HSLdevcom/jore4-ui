import { useHistory, useParams } from 'react-router-dom';
import { useGetLinesByLabelAndPriorityQuery } from '../../generated/graphql';
import { mapLinesByLabelAndPriorityResult } from '../../graphql';
import { Priority } from '../../types/Priority';
import { mapToVariables } from '../../utils';

export const useGetLineDraftDetails = () => {
  const { label } = useParams<{ label: string }>();
  const history = useHistory();

  const lineDetailsResult = useGetLinesByLabelAndPriorityQuery(
    mapToVariables({ label, priority: Priority.Draft }),
  );

  const lines = mapLinesByLabelAndPriorityResult(lineDetailsResult);

  const onClose = () => {
    history.goBack();
  };

  return { lines, onClose };
};
