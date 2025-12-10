import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../../../redux';
import { EnrichedParentStopPlace } from '../../../../types';
import { showToast } from '../../../../utils';
import { useLoader } from '../../../common/hooks';
import { useDirtyFormBlockNavigation } from '../../../forms/common/NavigationBlocker';
import {
  TerminalValidityFormState,
  terminalValidityFormSchema,
} from '../components/terminal-versions/TerminalValidityFormState';
import { EditTerminalValidityResult } from '../types';
import { useEditTerminalValidity } from './useEditTerminalValidity';

function useDefaultValues(
  originalTerminal: EnrichedParentStopPlace,
): TerminalValidityFormState {
  return useMemo(() => {
    return {
      indefinite: !originalTerminal.validityEnd,
      validityStart: originalTerminal.validityStart ?? '',
      validityEnd: originalTerminal.validityEnd,
      reasonForChange: null,
    };
  }, [originalTerminal]);
}

export const useEditTerminalValidityFormUtils = (
  originalTerminal: EnrichedParentStopPlace,
  onEditDone: (result: EditTerminalValidityResult) => void,
) => {
  const { t } = useTranslation();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);
  const defaultValues = useDefaultValues(originalTerminal);

  const { editTerminalValidity, defaultErrorHandler } =
    useEditTerminalValidity();

  const methods = useForm<TerminalValidityFormState>({
    defaultValues,
    resolver: zodResolver(terminalValidityFormSchema),
    mode: 'all',
  });
  useDirtyFormBlockNavigation(methods.formState, 'TerminalValidityForm');

  const handleSuccess = (result: EditTerminalValidityResult | null) => {
    if (!result) {
      return;
    }

    showToast({
      className: 'whitespace-pre-line',
      message: t('terminalDetails.version.success.edit'),
      type: 'success',
    });
    onEditDone(result);
  };

  const onFormSubmit = async (state: TerminalValidityFormState) => {
    setIsLoading(true);

    // Add reason for change here when implemented
    editTerminalValidity({ terminal: originalTerminal, state })
      .then(handleSuccess)
      .catch((err) => defaultErrorHandler(err, state));

    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
