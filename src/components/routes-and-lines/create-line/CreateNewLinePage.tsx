import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import {
  ReusableComponentsVehicleModeEnum,
  RouteLine,
} from '../../../generated/graphql';
import { mapInsertLineOneResult } from '../../../graphql';
import { useCreateLine } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { Priority } from '../../../types/Priority';
import { showSuccessToast } from '../../../utils';
import { FormState, LineForm } from '../../forms/line/LineForm';
import {
  ConflictResolverModal,
  mapLineToCommonConflictItem,
} from '../common/ConflictResolverModal';

export const CreateNewLinePage = (): JSX.Element => {
  const {
    prepareCreate,
    mapCreateChangesToVariables,
    insertLineMutation,
    defaultErrorHandler,
  } = useCreateLine();
  const [conflicts, setConflicts] = useState<RouteLine[]>([]);
  const [createdLineId, setCreatedLineId] = useState<UUID>();
  const { t } = useTranslation();

  const defaultValues = {
    primaryVehicleMode: ReusableComponentsVehicleModeEnum.Bus,
    priority: Priority.Draft,
  };

  const onSubmit = async (form: FormState) => {
    try {
      const changes = await prepareCreate({ form });
      if (changes.conflicts?.length) {
        setConflicts(changes.conflicts);
        return;
      }
      const variables = mapCreateChangesToVariables(changes);
      const result = await insertLineMutation({ variables });
      const createdLine = mapInsertLineOneResult(result);
      setCreatedLineId(createdLine?.line_id);
      showSuccessToast(t('lines.saveSuccess'));
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  if (createdLineId) {
    // if line was successfully created, redirect to its page
    return (
      <Redirect
        to={{ pathname: routeDetails[Path.lineDetails].getLink(createdLineId) }}
      />
    );
  }
  return (
    <Container>
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapLineToCommonConflictItem)}
      />
      <Row>
        <i className="icon-bus-alt text-5xl text-tweaked-brand" />
        <h1 className="text-5xl font-bold">{t('lines.createNew')}</h1>
      </Row>
      <LineForm onSubmit={onSubmit} defaultValues={defaultValues} />
    </Container>
  );
};
