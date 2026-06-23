import { FC } from 'react';
import { Row } from '../../../common/LayoutComponents';
import { ResultSelector } from '../../../common/search/ResultSelector';

export const FiltersContainer: FC = () => (
  <Row className="my-4">
    <ResultSelector />
  </Row>
);
