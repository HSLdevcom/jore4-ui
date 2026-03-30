import { gql } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Link } from 'react-router';
import { twJoin } from 'tailwind-merge';
import { LineWithRoutesUniqueFieldsFragment } from '../../../generated/graphql';
import { makeBackNavigationIsSafeState, useGetUserNames } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDateTime } from '../../../time';
import { Priority } from '../../../types/enums';
import { SimpleButton } from '../../../uiComponents';
import { PageTitle } from '../../common';
import { LineValidityPeriod } from './LineValidityPeriod';
import { useGetRoutesDisplayedInList } from './useGetRoutesDisplayedInList';

const testIds = {
  heading: 'LineTitle::heading',
  createRouteButton: 'LineTitle::createRouteButton',
  name: 'LineTitle::name',
  changeHistoryLink: 'LineTitle::changeHistoryLink',
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
    ...LineLatestChangeInfo
    line_routes(where: $lineRouteFilters) {
      ...route_unique_fields
    }
  }
`;

export const LineTitle: FC<LineTitleProps> = ({
  className,
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

  const { getUserNameById } = useGetUserNames();

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
    <Column className="grow items-stretch">
      <Row className={twJoin('items-center', className)}>
        <PageTitle.H1 className="mr-4" data-testid={testIds.heading}>
          {t('lines.line', { label: line.label })}
        </PageTitle.H1>

        <span className="mr-2 space-x-2">
          {lineRoutes?.length > 0 &&
            lineRoutes.map((item) => (
              <SimpleButton
                shape="compact"
                key={item.route_id}
                onClick={() => onRouteToggleClick(item.label)}
                inverted={!displayedRouteLabels?.includes(item.label)}
              >
                {item.label}
              </SimpleButton>
            ))}
        </span>

        {onCreateRoute && (
          <SimpleButton
            onClick={onCreateRoute}
            testId={testIds.createRouteButton}
            inverted
            className="flex items-center gap-2 border-0 bg-transparent px-1 py-0.5"
            aria-label={t(`accessibility.lines.createNewRoute`, {
              label: line.label,
            })}
          >
            <span className="font-normal text-black">
              {t('lines.newRoute')}
            </span>
            <AiFillPlusCircle className="text-2xl" />
          </SimpleButton>
        )}

        <div className="grow" />

        <Link
          to={routeDetails[Path.lineChangeHistory].getLink(line.label, {
            priority:
              line.priority === Priority.Standard ? undefined : line.priority,
          })}
          state={makeBackNavigationIsSafeState()}
          className="flex items-center text-base text-tweaked-brand hover:underline"
          data-testid={testIds.changeHistoryLink}
        >
          {mapToShortDateTime(line.change_history.at(0)?.changed)} |{' '}
          {getUserNameById(line.change_history.at(0)?.changed_by) ?? 'HSL'}{' '}
          <i className="icon-history text-xl" aria-hidden />
        </Link>
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
