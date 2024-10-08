import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Path, routeDetails } from '../../router/routeDetails';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: FC<Props> = ({ className = '', style }) => {
  const { t } = useTranslation();
  const target = routeDetails[Path.root];
  return (
    <Link
      to={target.getLink()}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      aria-label={t(target.translationKey!)}
      className={className}
      style={style}
    >
      <img src="/nav-logo.svg" alt="" />
    </Link>
  );
};
