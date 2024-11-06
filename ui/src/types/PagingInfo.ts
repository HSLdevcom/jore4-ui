export type PagingInfo = {
  readonly page: number;
  readonly pageSize: number;
};

export const defaultPagingInfo = {
  page: 1,
  pageSize: 10,
};
