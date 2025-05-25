import qs from 'qs';
import { FC } from 'react';
import { Navigate, NavigateProps } from 'react-router-dom';
import { useUrlQuery } from '../../hooks';

export const RedirectWithQuery: FC<NavigateProps> = ({
  to,
  ...propsWithoutTo
}) => {
  const { queryParams } = useUrlQuery();

  return (
    <Navigate
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...propsWithoutTo}
      to={{
        ...(typeof to === 'object' ? to : { pathname: to }),
        search: qs.stringify(queryParams),
      }}
    />
  );
};
