import qs from 'qs';
import React from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';
import { useUrlQuery } from '../../hooks';

export const RedirectWithQuery = (props: RedirectProps) => {
  const { queryParams } = useUrlQuery();
  return (
    <Redirect
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      to={{
        // eslint-disable-next-line react/destructuring-assignment
        ...(typeof props.to === 'object' ? props.to : {}),
        search: qs.stringify(queryParams),
      }}
    />
  );
};
