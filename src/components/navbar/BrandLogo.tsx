import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: FunctionComponent<Props> = ({ className, style }) => {
  const { t } = useTranslation();
  return (
    <Link
      to="/"
      aria-label={t('routes.root')}
      className={className}
      style={style}
    >
      <img src="/nav-logo.svg" alt="" />
    </Link>
  );
};
