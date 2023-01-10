import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { uniqBy } from 'remeda';
import { RouteLine } from '../../../generated/graphql';
import { useRouteLabelsQueryParam } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { IconButton, SimpleSmallButton } from '../../../uiComponents';
import { LineValidityPeriod } from './LineValidityPeriod';

const testIds = {
  heading: 'LineTitle::heading',
  createRouteButton: 'LineTitle::createRouteButton',
  name: 'LineTitle::name',
};

interface Props {
  className?: string;
  line: RouteLine;
  onCreateRoute?: () => void;
}

export const LineTitle: React.FC<Props> = ({
  className = '',
  line,
  onCreateRoute,
}) => {
  const { t } = useTranslation();
  const { toggleDisplayedRoute, displayedRouteLabels } =
    useRouteLabelsQueryParam();

  const lineRoutes = uniqBy(line.line_routes, (route) => route.label);

  return (
    <Column>
      <Row className={`items-center ${className}`}>
        <h1 className="mr-4" data-testid={testIds.heading}>
          {t('lines.line', { label: line.label })}
        </h1>
        <span className="space-x-2">
          {lineRoutes?.length > 0 &&
            lineRoutes.map((item) => (
              <SimpleSmallButton
                key={item.route_id}
                onClick={() => toggleDisplayedRoute(item.label)}
                inverted={!displayedRouteLabels?.includes(item.label)}
                label={item.label}
              />
            ))}
        </span>
        {onCreateRoute && (
          <IconButton
            testId={testIds.createRouteButton}
            icon={<AiFillPlusCircle className="ml-2 text-3xl text-brand" />}
            onClick={onCreateRoute}
          />
        )}
      </Row>
      <Row>
        <span className="font-bold" data-testid={testIds.name}>
          {line.name_i18n.fi_FI || ''}
        </span>
        {line.name_i18n.sv_FI && (
          <>
            <span className="mx-1">|</span>
            <span className="font-bold">{line.name_i18n.sv_FI || ''}</span>
          </>
        )}
      </Row>
      <LineValidityPeriod line={line} />
    </Column>
  );
};
