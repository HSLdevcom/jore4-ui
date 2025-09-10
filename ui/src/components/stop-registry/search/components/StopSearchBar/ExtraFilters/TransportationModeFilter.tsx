import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { Column, Row } from '../../../../../../layoutComponents';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import s from './TransportationModeFilter.module.css';

export const TransportationModeFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <Column className={className}>
      <label>{t('stopRegistrySearch.fieldLabels.transportMode')}</label>
      <Row
        className={twJoin(
          'text-[44px] leading-none text-tweaked-brand',
          s.noIconMargins,
        )}
      >
        <i className="icon-bus cursor-pointer" />
        <i className="icon-tram cursor-pointer" />
        <i className="icon-train cursor-pointer" />
        <i className="icon-ferry cursor-pointer" />
        <i className="icon-metro cursor-pointer" />
      </Row>
    </Column>
  );
};
