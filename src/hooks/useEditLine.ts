import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import {
  PatchLineMutationVariables,
  usePatchLineMutation,
} from '../generated/graphql';
import { mapToVariables, showDangerToast, showSuccessToast } from '../utils';
import { mapFormToMutation } from './useCreateLine';

export const useEditLine = () => {
  const { t } = useTranslation();
  const [patchLine] = usePatchLineMutation();

  const worker = async (lineId: UUID, state: FormState) => {
    const variables: PatchLineMutationVariables = {
      line_id: lineId,
      ...mapFormToMutation(state),
    };

    try {
      const result = await patchLine(mapToVariables(variables));
      showSuccessToast(t('lines.saveSuccess'));
      return result;
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
      throw err;
    }
  };

  return [worker];
};
