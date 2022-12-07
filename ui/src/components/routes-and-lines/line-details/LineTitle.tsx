import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { uniqBy } from 'remeda';
import { RouteLine } from '../../../generated/graphql';
import { useRouteLabelsQueryParam } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { IconButton, SimpleButton } from '../../../uiComponents';
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
        <span>
          {lineRoutes?.length > 0 &&
            lineRoutes.map((item) => (
              <SimpleButton
                key={item.route_id}
                containerClassName="mr-2"
                className="!mx-0 w-20 !rounded !px-0 !py-0 !text-sm !font-normal"
                invertedClassName="!text-black"
                onClick={() => toggleDisplayedRoute(item.label)}
                inverted={!displayedRouteLabels?.includes(item.label)}
              >
                {item.label}
              </SimpleButton>
            ))}
        </span>
        {onCreateRoute && (
          <IconButton
            testId={testIds.createRouteButton}
            icon={<AiFillPlusCircle className="text-3xl text-brand" />}
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
