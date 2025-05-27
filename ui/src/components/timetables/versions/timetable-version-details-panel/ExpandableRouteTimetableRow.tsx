import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { Row, Visible } from '../../../../layoutComponents';
import { AccordionButton } from '../../../../uiComponents';
import { DirectionBadge } from '../../../routes-and-lines/line-details/DirectionBadge';

type ExpandableRouteTimetableRowProps = {
  readonly direction: RouteDirectionEnum;
  readonly routeLabel: string;
  readonly routeName: string;
  readonly sectionIdentifier: string;
  readonly className?: string;
};

const testIds = {
  row: 'ExpandableRouteTimetableRow::row',
  expandButton: 'ExpandableRouteTimetableRow::AccordionButton',
};

export const ExpandableRouteTimetableRow: FC<
  PropsWithChildren<ExpandableRouteTimetableRowProps>
> = ({
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
    <div data-testid={testIds.row} className={className}>
      <Row>
        <div className="flex flex-1 items-center bg-background">
          <DirectionBadge direction={direction} className="my-5 ml-12" />
          <div className="ml-3.5 mt-1">
            <h3 className="text-base">{routeLabel}</h3>
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
      <Visible visible={isExpanded}>{children}</Visible>
    </div>
  );
};
