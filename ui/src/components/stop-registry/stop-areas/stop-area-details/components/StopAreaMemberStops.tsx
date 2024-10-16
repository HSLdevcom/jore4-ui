import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import React, {
  Dispatch,
  FC,
  FormEventHandler,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../../../../../hooks';
import { Operation } from '../../../../../redux';
import { ConfirmationDialog } from '../../../../../uiComponents';
import { showSuccessToast } from '../../../../../utils';
import {
  StopAreaFormState as FormState,
  StopAreaFormMember,
  StopAreaFormState,
  stopAreaFormSchema,
  useUpsertStopArea,
} from '../../../../forms/stop-area';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';
import { EditableStopAreaComponentProps } from './StopAreaComponentProps';
import { mapStopAreaDataToFormState } from './StopAreaDetailsEdit';
import { StopAreaMemberStopRows } from './StopAreaMemberStopRows';
import { StopAreaMemberStopsHeader } from './StopAreaMemberStopsHeader';

type RootComponentProps = {
  readonly children: ReactNode;
  readonly className: string;
  readonly inEditMode: boolean;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
};

const RootComponent: FC<RootComponentProps> = ({
  children,
  className,
  inEditMode,
  onSubmit,
}) => {
  if (inEditMode) {
    return (
      <form className={className} onSubmit={onSubmit}>
        {children}
      </form>
    );
  }

  return <div className={className}>{children}</div>;
};

function useMemberStopFormControls(
  areaId: string | null | undefined,
  defaultValues: Partial<FormState>,
  onEditBlock: Dispatch<SetStateAction<StopAreaEditableBlock | null>>,
  refetch: () => Promise<unknown>,
  t: TFunction,
) {
  const [stopToRemove, setStopToRemove] = useState<string | null>(null);

  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();
  const { setIsLoading } = useLoader(Operation.ModifyStopArea);

  const onSubmit = async (state: StopAreaFormState) => {
    setIsLoading(true);
    try {
      await upsertStopArea({ id: areaId, state });
      await refetch();

      showSuccessToast(t('stopArea.editSuccess'));
      onEditBlock(null);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  const removeStop = async (id: string) => {
    setIsLoading(true);
    try {
      // By all means defaultValue should have all needed fields,
      // but typings says every field could be undefined.
      // Ensure the data passes the default form validation.
      const state = stopAreaFormSchema.parse(defaultValues);

      await upsertStopArea({
        id: areaId,
        state: {
          ...state,
          memberStops: state.memberStops.filter((stop) => stop.id !== id),
        },
      });
      await refetch();

      setStopToRemove(null);
      showSuccessToast(t('stopArea.editSuccess'));
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(stopAreaFormSchema),
  });

  return {
    stopToRemove,
    setStopToRemove,

    submit: methods.handleSubmit(onSubmit),
    removeStop,

    methods,
  };
}

export const StopAreaMemberStops: FC<EditableStopAreaComponentProps> = ({
  area,
  className = '',
  blockInEdit,
  onEditBlock,
  refetch,
}) => {
  const { t } = useTranslation();

  const defaultValues = useMemo(() => mapStopAreaDataToFormState(area), [area]);
  const {
    stopToRemove,
    setStopToRemove,

    submit,
    removeStop,

    methods,
  } = useMemberStopFormControls(
    area.id,
    defaultValues,
    onEditBlock,
    refetch,
    t,
  );
  const { setValue, getValues, watch, reset } = methods;

  const onEditStops = () => {
    // useForm does not react to changes in defaultValues.
    // We need to manually apply the new state, in case the area has
    // already been updated once during the session.
    reset(defaultValues);
    onEditBlock(StopAreaEditableBlock.MEMBERS);
  };

  const onCancelEdit = () => onEditBlock(null);

  const onRemoveWhenEditing = (id: string) => {
    setValue(
      'memberStops',
      getValues('memberStops').filter((it) => it.id !== id),
    );
  };

  const onRemoveWhenNotEditing = (id: string) => {
    setStopToRemove(id);
  };

  const onAddBack = (member: StopAreaFormMember) => {
    setValue(
      'memberStops',
      getValues('memberStops')
        .concat(member)
        .sort((a, b) =>
          a.scheduled_stop_point.label.localeCompare(
            b.scheduled_stop_point.label,
          ),
        ),
    );
  };

  const inEditMode = blockInEdit === StopAreaEditableBlock.MEMBERS;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <RootComponent
        className={className}
        inEditMode={inEditMode}
        onSubmit={submit}
      >
        <div className="flex items-center gap-4">
          <h2>{t('stopAreaDetails.memberStops.title')}</h2>

          <StopAreaMemberStopsHeader
            areaId={area.id}
            blockInEdit={blockInEdit}
            onCancel={onCancelEdit}
            onEditStops={onEditStops}
          />
        </div>

        <StopAreaMemberStopRows
          area={area}
          inEditMode={inEditMode}
          inEditSelectedStops={watch('memberStops')}
          onRemove={inEditMode ? onRemoveWhenEditing : onRemoveWhenNotEditing}
          onAddBack={onAddBack}
        />
      </RootComponent>

      <ConfirmationDialog
        isOpen={stopToRemove !== null}
        onConfirm={() => removeStop(stopToRemove ?? '')}
        onCancel={() => setStopToRemove(null)}
        title={t('stopAreaDetails.memberStops.confirmRemoval.title')}
        description={t('stopAreaDetails.memberStops.confirmRemoval.body')}
        confirmText={t('remove')}
        cancelText={t('cancel')}
      />
    </FormProvider>
  );
};
