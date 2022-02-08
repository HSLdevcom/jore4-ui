import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import {
  ReusableComponentsVehicleModeEnum,
  useInsertLineOneMutation,
} from '../generated/graphql';
import { mapInsertLineOneResult } from '../graphql/route';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { Priority } from '../types/Priority';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showToast,
} from '../utils';
import { EditLineForm, FormState } from './routes-and-lines/EditLineForm';

export const CreateNewLinePage = (): JSX.Element => {
  const [mutateFunction] = useInsertLineOneMutation();
  const [createdLineId, setCreatedLineId] = useState<UUID>();
  const { t } = useTranslation();

  const defaultValues = {
    primaryVehicleMode: ReusableComponentsVehicleModeEnum.Bus,
    priority: Priority.Draft,
  };

  const onSubmit = async (state: FormState) => {
    const variables = mapToObject({
      label: state.label,
      name_i18n: state.finnishName,
      primary_vehicle_mode: state.primaryVehicleMode,
      priority: state.priority,
      validity_start: mapDateInputToValidityStart(state.validityStart),
      validity_end: mapDateInputToValidityEnd(
        state.validityEnd,
        state.indefinite,
      ),
    });

    try {
      const result = await mutateFunction(mapToVariables(variables));
      const createdLine = mapInsertLineOneResult(result);

      showToast({ type: 'success', message: t('routes.saveSuccess') });
      // eslint-disable-next-line no-console
      console.log('Line created successfully.', result);

      setCreatedLineId(createdLine?.line_id);
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
    }
  };

  if (createdLineId) {
    // if line was successfully created, redirect to its page
    return (
      <Redirect
        to={{ pathname: routes[Path.lineDetails].getLink(createdLineId) }}
      />
    );
  }
  return (
    <Container>
      <Row>
        <i className="icon-bus-alt text-5xl text-tweaked-brand" />
        <h1 className="text-5xl font-bold">{t('lines.createNew')}</h1>
      </Row>
      <EditLineForm onSubmit={onSubmit} defaultValues={defaultValues} />
    </Container>
  );
};
