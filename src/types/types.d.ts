// Trick for preventing linter warnings in places where any is needed as type
type ExplicitAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

type UUID = string;

type LocalizedString = {
  // eslint-disable-next-line camelcase
  fi_FI?: string;
  // eslint-disable-next-line camelcase
  sv_FI?: string;
};
