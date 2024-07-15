import qs from 'qs';
import { Navigate, NavigateProps } from 'react-router-dom';
import { useUrlQuery } from '../../hooks';

export const RedirectWithQuery = (props: NavigateProps): React.ReactElement => {
  const { queryParams } = useUrlQuery();
  const { to, ...propsWithoutTo } = props;
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
