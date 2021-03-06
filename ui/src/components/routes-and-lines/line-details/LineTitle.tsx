import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { RouteLine } from '../../../generated/graphql';
import { Column, Row } from '../../../layoutComponents';
import { IconButton, SimpleButton } from '../../../uiComponents';
import { LineValidityPeriod } from './LineValidityPeriod';

interface Props {
  className?: string;
  line: RouteLine;
  onCreateRoute: () => void;
}

export const LineTitle: React.FC<Props> = ({
  className = '',
  line,
  onCreateRoute,
}) => {
  const { t } = useTranslation();

  const onToggleRoute = () => {
    // eslint-disable-next-line no-console
    console.log('TODO');
  };

  return (
    <Column>
      <Row className={`items-center ${className}`}>
        <span
          className="mr-4 text-4xl font-bold"
          data-testid="line-page-heading"
        >
          {t('lines.line', { label: line.label })}
        </span>
        <span>
          {line.line_routes?.length > 0 &&
            line.line_routes.map((item) => (
              <SimpleButton
                key={item.route_id}
                containerClassName="mr-2"
                className="w-20 !rounded bg-tweaked-brand !px-0 !py-0 !text-sm !font-light text-white"
                onClick={onToggleRoute}
              >
                {item.label}
              </SimpleButton>
            ))}
        </span>
        <IconButton
          testId="LineTitle:createRouteButton"
          icon={<AiFillPlusCircle className="text-3xl text-brand" />}
          onClick={onCreateRoute}
        />
      </Row>
      <Row>
        <span className="font-bold" data-testid="line-header-name">
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
