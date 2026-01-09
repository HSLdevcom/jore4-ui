import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Column } from '../../../../../layoutComponents';
import { Operation } from '../../../../../redux';
import { EnrichedParentStopPlace } from '../../../../../types';
import { showSuccessToast } from '../../../../../utils';
import { useLoader } from '../../../../common/hooks/useLoader';
import {
  FormActionButtons,
  FormRow,
  InputField,
} from '../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../forms/common/NavigationBlocker';
import { OwnerOrganizationFields } from './OwnerOrganisationFields';
import {
  TerminalOwnerFormState,
  terminalOwnerSchema,
} from './terminalOwnerSchema';
import { useUpdateTerminalOwner } from './useUpdateTerminalOwner';

const testIds = {
  ownerRef: 'OwnerDetailsEdit::ownerRef',
  contractId: 'OwnerDetailsEdit::contractId',
  note: 'OwnerDetailsEdit::note',
};

function mapTerminalOwnerToFormState({
  owner,
}: EnrichedParentStopPlace): TerminalOwnerFormState {
  return {
    ownerRef: owner?.organizationRef,
    contractId: owner?.contractId,
    note: owner?.note,
  };
}

type OwnerDetailsEditProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
  readonly onFinishEditing: () => void;
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
};

const OwnerDetailsEditImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  OwnerDetailsEditProps
> = ({ terminal, className, onFinishEditing, onCancel, testIdPrefix }, ref) => {
  const { t } = useTranslation();

  const { updateOwner, defaultErrorHandler } = useUpdateTerminalOwner();
  const { setIsLoading } = useLoader(Operation.ModifyTerminal);
  const onSubmit = async (state: TerminalOwnerFormState) => {
    setIsLoading(true);
    try {
      await updateOwner({ terminal, state });

      showSuccessToast(t('terminalDetails.editSuccess'));
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const defaultValues = useMemo(
    () => mapTerminalOwnerToFormState(terminal),
    [terminal],
  );
  const methods = useForm<TerminalOwnerFormState>({
    defaultValues,
    resolver: zodResolver(terminalOwnerSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'TerminalDetailsEdit');

  const selectedOwnerRef = methods.watch('ownerRef') ?? null;
  const noOwner = String(selectedOwnerRef) === 'null';

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-6', className)}
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={ref}
      >
        <FormRow xlColumns={4} mdColumns={2}>
          <OwnerOrganizationFields testId={testIds.ownerRef} />

          <Column>
            <InputField<TerminalOwnerFormState>
              type="text"
              translationPrefix="terminalDetails.owner"
              fieldPath="contractId"
              testId={testIds.contractId}
              disabled={noOwner}
            />
          </Column>

          <Column className="col-span-2">
            <InputField<TerminalOwnerFormState>
              type="textarea"
              translationPrefix="terminalDetails.owner"
              fieldPath="note"
              testId={testIds.note}
              disabled={noOwner}
              maxLength={255}
            />
          </Column>
        </FormRow>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
          className="!-mb-5"
        />
      </form>
    </FormProvider>
  );
};

export const OwnerDetailsEdit = forwardRef(OwnerDetailsEditImpl);
