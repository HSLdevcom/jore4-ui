import { useTranslation } from 'react-i18next';
import { TimetableWithMetadata } from '../../../hooks';
import { useToggle } from '../../../hooks/useToggle';
import { Row, Visible } from '../../../layoutComponents';
import { AccordionButton } from '../../../uiComponents';
import { VehicleServiceTable } from './vehicle-service-table';

interface Props {
  timetable: TimetableWithMetadata;
  initiallyOpen?: boolean;
}

const testIds = {
  accordionToggle: 'VehicleRouteTimetableSection::AccordionToggle',
};

export const VehicleRouteTimetableSection = ({
  timetable,
  initiallyOpen = false,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle(initiallyOpen);

  return (
    <div>
      <Row>
        <div className="flex flex-1 items-center bg-background">
          <h3 className="ml-14">!REITTI</h3>
        </div>
        <div className="ml-1 bg-background p-3">
          <AccordionButton
            className="h-full w-full"
            iconClassName="text-3xl"
            isOpen={isOpen}
            onToggle={toggleIsOpen}
            testId={testIds.accordionToggle}
          />
        </div>
      </Row>
      <Visible visible={isOpen}>
        <div className="mt-8 grid grid-cols-3 gap-x-8 gap-y-5">
          {timetable.vehicleServices.map((item) => (
            <VehicleServiceTable
              priority={item.priority}
              dayType={item.dayType}
              key={`${item.priority}-${item.dayType.day_type_id}`}
              vehicleServices={item.vehicleServices}
            />
          ))}
        </div>
        <Visible visible={!timetable.vehicleServices.length}>
          <p>{t('timetables.noService')}</p>
        </Visible>
      </Visible>
    </div>
  );
};
