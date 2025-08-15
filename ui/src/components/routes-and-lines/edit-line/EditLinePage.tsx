import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import {
  LineAllFieldsFragment,
  useGetLineDetailsByIdQuery,
} from '../../../generated/graphql';
import { mapLineDetailsResult } from '../../../graphql';
import { useEditLine, useRequiredParams } from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToISODate } from '../../../time';
import {
  defaultLocalizedString,
  mapToVariables,
  showSuccessToast,
} from '../../../utils';
import { PageTitle } from '../../common';
import { FormState, LineForm } from '../../forms/line/LineForm';
import {
  ConflictResolverModal,
  mapLineToCommonConflictItem,
} from '../common/ConflictResolverModal';
import { PageHeader } from '../common/PageHeader';

const mapLineToFormState = (line: LineAllFieldsFragment): FormState => ({
  label: line.label,
  name: defaultLocalizedString(line.name_i18n),
  shortName: defaultLocalizedString(line.short_name_i18n),
  primaryVehicleMode: line.primary_vehicle_mode,
  priority: line.priority,
  transportTarget: line.transport_target,
  typeOfLine: line.type_of_line,
  validityStart: mapToISODate(line.validity_start) ?? '',
  validityEnd: mapToISODate(line.validity_end) ?? '',
  indefinite: !line.validity_end,
});

export const EditLinePage: FC = () => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [conflicts, setConflicts] = useState<
    ReadonlyArray<LineAllFieldsFragment>
  >([]);
  const {
    prepareEdit,
    mapEditChangesToVariables,
    editLineMutation,
    defaultErrorHandler,
  } = useEditLine();

  const { id } = useRequiredParams<{ id: string }>();
  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);
  const { t } = useTranslation();

  const onSubmit = async (form: FormState) => {
    try {
      const changes = await prepareEdit({ lineId: id, form });
      if (changes.conflicts?.length) {
        setConflicts(changes.conflicts);
        return;
      }
      const variables = mapEditChangesToVariables(changes);
      await editLineMutation({ variables });
      setHasFinishedEditing(true);
      showSuccessToast(t('lines.saveSuccess'));
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  if (hasFinishedEditing) {
    // if line was successfully edited, redirect to its page
    return (
      <Navigate to={{ pathname: routeDetails[Path.lineDetails].getLink(id) }} />
    );
  }

  const pageTitleText = t('lines.line', { label: line?.label });

  return (
    <div>
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapLineToCommonConflictItem)}
      />
      <PageHeader>
        <PageTitle.H1 titleText={pageTitleText}>
          <i className="icon-bus-alt text-tweaked-brand" />
          {pageTitleText}
        </PageTitle.H1>
      </PageHeader>
      <Container>
        {line && (
          <LineForm
            onSubmit={onSubmit}
            defaultValues={mapLineToFormState(line)}
          />
        )}
      </Container>
    </div>
  );
};
