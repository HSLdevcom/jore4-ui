import { gql } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { LineWithRoutesUniqueFieldsFragment } from '../../../generated/graphql';
import { useGetRoutesDisplayedInList } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { IconButton, SimpleSmallButton } from '../../../uiComponents';
import { PageTitle } from '../../common';
import { LineValidityPeriod } from './LineValidityPeriod';

const testIds = {
  heading: 'LineTitle::heading',
  createRouteButton: 'LineTitle::createRouteButton',
  name: 'LineTitle::name',
};

type LineTitleProps = {
  readonly className?: string;
  readonly line: LineWithRoutesUniqueFieldsFragment;
  readonly onCreateRoute?: () => void;
  readonly showValidityPeriod?: boolean;
  readonly allowSelectingMultipleRoutes?: boolean;
};

const GQL_LINE_WITH_ROUTES_UNIQUE_FIELDS = gql`
  fragment line_with_routes_unique_fields on route_line {
    ...line_all_fields
    line_routes(where: $lineRouteFilters) {
      ...route_unique_fields
    }
  }
`;

export const LineTitle: FC<LineTitleProps> = ({
  className = '',
  line,
  onCreateRoute,
  showValidityPeriod = true,
  allowSelectingMultipleRoutes = true,
}) => {
  const { t } = useTranslation();
  const {
    toggleDisplayedRoute,
    displayedRouteLabels,
    setDisplayedRoutesToUrl,
  } = useGetRoutesDisplayedInList(line);

  const onRouteToggleClick = (label: string) => {
    // If "multiple route select" is disabled, only one route can be selected at once
    if (allowSelectingMultipleRoutes) {
      toggleDisplayedRoute(label);
    } else {
      setDisplayedRoutesToUrl([label]);
    }
  };

  const lineRoutes = uniqBy(line.line_routes, (route) => route.label);
  return (
    <Column>
      <Row className={`items-center ${className}`}>
        <PageTitle.H1 className="mr-4" data-testid={testIds.heading}>
          {t('lines.line', { label: line.label })}
        </PageTitle.H1>
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
            tooltip={t(`accessibility:lines.createNewRoute`, {
              label: line.label,
            })}
            testId={testIds.createRouteButton}
            icon={<AiFillPlusCircle className="text-3xl text-brand" />}
            className="ml-2 rounded-full"
            onClick={onCreateRoute}
          />
        )}
      </Row>
      <Row>
        <span className="font-bold" data-testid={testIds.name}>
          {line.name_i18n.fi_FI ?? ''}
        </span>
        {line.name_i18n.sv_FI && (
          <>
            <span className="mx-1">|</span>
            <span className="font-bold">{line.name_i18n.sv_FI ?? ''}</span>
          </>
        )}
      </Row>
      {showValidityPeriod && <LineValidityPeriod line={line} />}
    </Column>
  );
};
