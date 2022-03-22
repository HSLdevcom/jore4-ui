import React from 'react';
import { Row } from '../../../../layoutComponents';
import { ResultSelector } from './ResultSelector';

export const FiltersContainer = (): JSX.Element => (
  <Row className="my-4">
    <ResultSelector />
  </Row>
);
