import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import {
  LineAllFieldsFragment,
  useGetLineDetailsByIdQuery,
} from '../../../generated/graphql';
import { mapLineDetailsResult } from '../../../graphql';
import { useNavigateBackSafely, useRequiredParams } from '../../../hooks';
import { Operation } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToISODate } from '../../../time';
import {
  defaultLocalizedString,
  mapToVariables,
  showSuccessToast,
  vehicleModeIconMapping,
} from '../../../utils';
import { PageTitle } from '../../common';
import { useLoader } from '../../common/hooks';
import { Container } from '../../common/LayoutComponents';
import { FormState, LineForm } from '../../forms/line/LineForm';
import {
  ConflictResolverModal,
  mapLineToCommonConflictItem,
} from '../common/ConflictResolverModal';
import { PageHeader } from '../common/PageHeader';
import { getBlockers, hasBlockers } from '../common/SaveBlockers';
import { StopsNeedingUpdateModal } from '../common/StopsNeedingUpdateModal';
import { useUpdateStopRegistryStopMetatype } from '../common/useUpdateStopRegistryStopMetatype';
import { EditLineChanges, useEditLine } from './useEditLine';

function mapLineToFormState(line: LineAllFieldsFragment): FormState {
  return {
    label: line.label,
    description: line.description ?? undefined,
    versionComment: '',
    name: defaultLocalizedString(line.name_i18n),
    shortName: defaultLocalizedString(line.short_name_i18n),
    primaryVehicleMode: line.primary_vehicle_mode,
    priority: line.priority,
    transportTarget: line.transport_target,
    typeOfLine: line.type_of_line,
    validityStart: mapToISODate(line.validity_start) ?? '',
    validityEnd: mapToISODate(line.validity_end) ?? '',
    indefinite: !line.validity_end,
  };
}

export const EditLinePage: FC = () => {
  const { t } = useTranslation();

  const { id } = useRequiredParams<{ id: string }>();
  const navigateBack = useNavigateBackSafely();

  const { setIsLoading } = useLoader(Operation.UpdateLine);

  // Needed to disable the rendering of the actual form element,
  // that blocks navigation after save.
  const [saved, setSaved] = useState<boolean>(false);
  const [pendingEditChanges, setPendingEditChanges] =
    useState<EditLineChanges | null>(null);

  const {
    prepareEdit,
    mapEditChangesToVariables,
    editLineMutation,
    defaultErrorHandler,
  } = useEditLine();
  const updateStopRegistryStopMetatype = useUpdateStopRegistryStopMetatype();

  const line = mapLineDetailsResult(
    // Instead of subscribing to cache changes, we should only fetch the data once.
    useGetLineDetailsByIdQuery(mapToVariables({ line_id: id })),
  );

  const onCommitEditChanges = async (changes: EditLineChanges) => {
    setIsLoading(true);
    try {
      setPendingEditChanges(null);

      await editLineMutation({ variables: mapEditChangesToVariables(changes) });
      await updateStopRegistryStopMetatype(changes.stopsNeedingUpdate);

      // Mark the line as saved
      setSaved(true);
      showSuccessToast(t(($) => $.lines.saveSuccess));

      // Navigate back to the previous page after this page has re-rendered.
      setTimeout(
        () =>
          navigateBack(routeDetails[Path.lineDetails].getLink(id), {
            replace: true,
          }),
        0,
      );
    } catch (err) {
      defaultErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (form: FormState) => {
    setIsLoading(true);
    try {
      const changes = await prepareEdit({ lineId: id, form });

      if (hasBlockers(changes)) {
        setPendingEditChanges(changes);
      } else {
        await onCommitEditChanges(changes);
      }
    } catch (err) {
      defaultErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitleText = t(($) => $.lines.edit, {
    label: line?.label,
    name: line?.name_i18n.fi_FI,
  });

  const blockers = getBlockers(pendingEditChanges);

  return (
    <div>
      {pendingEditChanges ? (
        <>
          <ConflictResolverModal
            isOpen={blockers.hasConflicts}
            onClose={() => setPendingEditChanges(null)}
            conflicts={pendingEditChanges.conflicts.map(
              mapLineToCommonConflictItem,
            )}
          />

          <StopsNeedingUpdateModal
            isOpen={!blockers.hasConflicts && blockers.hasStopsNeedingUpdate}
            onCancel={() => setPendingEditChanges(null)}
            onConfirm={() => onCommitEditChanges(pendingEditChanges)}
            stops={pendingEditChanges.stopsNeedingUpdate}
            typeOfLine={pendingEditChanges.patch.type_of_line}
          />
        </>
      ) : null}

      <PageHeader>
        <div className="flex items-center">
          {line?.primary_vehicle_mode && (
            <i
              className={twJoin(
                vehicleModeIconMapping[line.primary_vehicle_mode],
                'text-5xl',
              )}
            />
          )}
          <PageTitle.H1 titleText={pageTitleText}>{pageTitleText}</PageTitle.H1>
        </div>
      </PageHeader>
      <Container className="pt-0">
        {line && !saved && (
          <LineForm
            onSubmit={onSubmit}
            defaultValues={mapLineToFormState(line)}
            editing
            validityPeriodTitle={t(($) => $.lines.lineValidityPeriod)}
          />
        )}
      </Container>
    </div>
  );
};
