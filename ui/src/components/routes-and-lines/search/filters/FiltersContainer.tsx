import { Row } from '../../../../layoutComponents';
import { ResultSelector } from '../../../common/search/ResultSelector';

export const FiltersContainer = (): JSX.Element => (
  <Row className="my-4">
    <ResultSelector />
  </Row>
);
