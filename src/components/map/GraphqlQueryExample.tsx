import React from 'react';
import { useMyQueryQuery } from '../../generated/graphql';

export const GraphqlQueryExample: React.FC = () => {
  const { data } = useMyQueryQuery();
  // eslint-disable-next-line no-console
  console.log('Graphql example query result', data);
  return null;
};
