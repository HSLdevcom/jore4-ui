import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { Row } from '../../../../layoutComponents';
import { AccordionButton } from '../../../../uiComponents';
import { DirectionBadge } from '../../../routes-and-lines/line-details/DirectionBadge';

interface Props {
  direction: RouteDirectionEnum;
  routeLabel: string;
  routeName: string;
  sectionIdentifier: string;
  className?: string;
}

const testIds = {
  expandButton: 'ExpandableRouteTimetableRow::AccordionButton',
};

export const ExpandableRouteTimetableRow: React.FC<Props> = ({
  children,
  direction,
  routeLabel,
  routeName,
  sectionIdentifier,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={className}>
      <Row>
        <div className="flex flex-1 items-center bg-background">
          <DirectionBadge
            direction={direction}
            className="my-5 ml-12"
            titleName={t(`directionEnum.${direction}`)}
          />
          <div className="ml-3.5 mt-1">
            <span className="block font-bold">{routeLabel}</span>
            {routeName}
          </div>
        </div>
        <div className="ml-1 bg-background p-3">
          <AccordionButton
            className="h-full w-full"
            iconClassName="text-3xl"
            isOpen={isExpanded}
            onToggle={setIsExpanded}
            testId={testIds.expandButton}
            controls={sectionIdentifier}
            openTooltip={t('accessibility:routes.expandTimetable', {
              routeName,
            })}
            closeTooltip={t('accessibility:routes.closeTimetable', {
              routeName,
            })}
          />
        </div>
      </Row>
      {/* TODO: Can't use <Visible> component after its change. Resolve this after
      possible rework of that component */}
      {isExpanded && <>{children}</>}
    </div>
  );
};
