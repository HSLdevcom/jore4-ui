import { gql } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { uniqBy } from 'remeda';
import { LineWithRoutesUniqueFieldsFragment } from '../../../generated/graphql';
import { useGetRoutesDisplayedInList } from '../../../hooks';
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
  line: LineWithRoutesUniqueFieldsFragment;
  onCreateRoute?: () => void;
  hideValidityPeriod?: boolean;
  singleRouteSelect?: boolean;
}

const GQL_LINE_WITH_ROUTES_UNIQUE_FIELDS = gql`
  fragment line_with_routes_unique_fields on route_line {
    ...line_all_fields
    line_routes(where: $lineRouteFilters) {
      ...route_unique_fields
    }
  }
`;

export const LineTitle: React.FC<Props> = ({
  className = '',
  line,
  onCreateRoute,
  hideValidityPeriod,
  singleRouteSelect,
}) => {
  const { t } = useTranslation();
  const {
    toggleDisplayedRoute,
    displayedRouteLabels,
    setDisplayedRoutesToUrl,
  } = useGetRoutesDisplayedInList(line);

  const onRouteToggleClick = (label: string) => {
    // If "single route select" is enabled, only one route can be selected at once
    singleRouteSelect
      ? setDisplayedRoutesToUrl([label])
      : toggleDisplayedRoute(label);
  };

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
                onClick={() => onRouteToggleClick(item.label)}
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
      {!hideValidityPeriod && <LineValidityPeriod line={line} />}
    </Column>
  );
};
