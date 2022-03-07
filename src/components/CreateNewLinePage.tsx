import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { ReusableComponentsVehicleModeEnum } from '../generated/graphql';
import { mapInsertLineOneResult } from '../graphql';
import { useCreateLine } from '../hooks';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { Priority } from '../types/Priority';
import { FormState, LineForm } from './forms/LineForm';

export const CreateNewLinePage = (): JSX.Element => {
  const [saveLine] = useCreateLine();
  const [createdLineId, setCreatedLineId] = useState<UUID>();
  const { t } = useTranslation();

  const defaultValues = {
    primaryVehicleMode: ReusableComponentsVehicleModeEnum.Bus,
    priority: Priority.Draft,
  };

  const onSubmit = async (state: FormState) => {
    try {
      const result = await saveLine(state);
      const createdLine = mapInsertLineOneResult(result);
      setCreatedLineId(createdLine?.line_id);
    } catch (err) {
      // noop
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
      <LineForm onSubmit={onSubmit} defaultValues={defaultValues} />
    </Container>
  );
};
