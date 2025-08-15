import { FC } from 'react';
import { Row } from '../../../../layoutComponents';
import { ResultSelector } from '../../../common/search/ResultSelector';

export const FiltersContainer: FC = () => (
  <Row className="my-4">
    <ResultSelector />
  </Row>
);
