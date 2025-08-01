export type UserInfo = {
  id: string;
  fullName?: string;
  givenName?: string;
  familyName?: string;
  permissions: ReadonlyArray<string>;
};
