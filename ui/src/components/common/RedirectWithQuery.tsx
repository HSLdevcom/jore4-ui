import qs from 'qs';
import { Redirect, RedirectProps } from 'react-router-dom';
import { useUrlQuery } from '../../hooks';

export const RedirectWithQuery = (props: RedirectProps): JSX.Element => {
  const { queryParams } = useUrlQuery();
  const { to, ...propsWithoutTo } = props;
  return (
    <Redirect
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...propsWithoutTo}
      to={{
        ...(typeof to === 'object' ? to : { pathname: to }),
        search: qs.stringify(queryParams),
      }}
    />
  );
};
