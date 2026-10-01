import qs from 'qs';
import { FC } from 'react';
import { Navigate, NavigateProps } from 'react-router';
import { useUrlQuery } from '../../../../hooks';

export const RedirectWithQuery: FC<NavigateProps> = ({
  to,
  ...propsWithoutTo
}) => {
  const { queryParams } = useUrlQuery();

  return (
    <Navigate
      {...propsWithoutTo}
      to={{
        ...(typeof to === 'object' ? to : { pathname: to }),
        search: qs.stringify(queryParams),
      }}
    />
  );
};
