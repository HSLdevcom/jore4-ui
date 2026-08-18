import { FC } from 'react';
import { Row } from '../../../LayoutComponents';
import { ResultSelector } from '../ResultSelector';

export const FiltersContainer: FC = () => (
  <Row className="my-4">
    <ResultSelector />
  </Row>
);
