import { Row } from '../../../../layoutComponents';
import { Path } from '../../../../router/routeDetails';
import { ResultSelector } from '../../../common/search/ResultSelector';

export const FiltersContainer = (): JSX.Element => (
  <Row className="my-4">
    <ResultSelector basePath={Path.routes} />
  </Row>
);
