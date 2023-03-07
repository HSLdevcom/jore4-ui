import { useTranslation } from 'react-i18next';
import {
  useGetLineDetails,
  useTimetableVersionsReturnToQueryParam,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormColumn, FormRow } from '../../forms/common';
import { PageHeader } from '../../routes-and-lines/common/PageHeader';
import { VehicleRouteTimetables } from './VehicleRouteTimetables';

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const { line } = useGetLineDetails();

  const { getVersionsUrl } = useTimetableVersionsReturnToQueryParam();

  return (
    <div>
      <PageHeader>
        <h1>
          <i className="icon-bus-alt text-tweaked-brand" />
          {t('lines.line', { label: line?.label })}
        </h1>
      </PageHeader>
      <Container className="py-10">
        <FormRow mdColumns={2} className="mb-8 ">
          <ObservationDateControl className="max-w-max" />
          <FormColumn className="items-end justify-end">
            {line && (
              <SimpleButton
                inverted
                href={getVersionsUrl(line.label, line.line_id)}
              >
                {t('timetables.showVersions')}
              </SimpleButton>
            )}
          </FormColumn>
        </FormRow>
        <VehicleRouteTimetables routes={line?.line_routes || []} />
      </Container>
    </div>
  );
};
