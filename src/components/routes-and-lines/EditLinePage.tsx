import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router-dom';
import { RouteLine, useGetLineDetailsByIdQuery } from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql';
import { useEditLine } from '../../hooks';
import { Container } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import { mapToISODate } from '../../time';
import { mapToVariables } from '../../utils';
import {
  ConflictResolverModal,
  mapLineToCommonConflictItem,
} from '../ConflictResolverModal';
import { FormState, LineForm } from '../forms/LineForm';
import { PageHeader } from './PageHeader';

export const EditLinePage = (): JSX.Element => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [conflicts, setConflicts] = useState<RouteLine[]>([]);
  const {
    prepareEdit,
    mapEditChangesToVariables,
    editLineMutation,
    defaultErrorHandler,
  } = useEditLine();

  const { id } = useParams<{ id: string }>();
  const lineDetailsResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: id }),
  );
  const line = mapLineDetailsResult(lineDetailsResult);
  const { t } = useTranslation();

  const defaultValues = {
    label: line?.label,
    finnishName: line?.name_i18n,
    primaryVehicleMode: line?.primary_vehicle_mode,
    priority: line?.priority,
    validityStart: mapToISODate(line?.validity_start),
    validityEnd: mapToISODate(line?.validity_end),
    indefinite: !line?.validity_end,
  };

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
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  if (hasFinishedEditing) {
    // if line was successfully edited, redirect to its page
    return <Redirect to={{ pathname: routes[Path.lineDetails].getLink(id) }} />;
  }

  return (
    <div>
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapLineToCommonConflictItem)}
      />
      <PageHeader>
        <i className="icon-bus-alt text-5xl text-tweaked-brand" />
        <h1 className="text-5xl font-bold">
          {`${t('lines.line')} ${line?.label}`}
        </h1>
      </PageHeader>
      <Container>
        <LineForm onSubmit={onSubmit} defaultValues={defaultValues} />
      </Container>
    </div>
  );
};
