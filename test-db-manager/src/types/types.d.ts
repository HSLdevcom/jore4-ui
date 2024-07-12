// load type definitions for Luxon
/// <reference types="@types/luxon" />

declare namespace luxon {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

// Trick for preventing linter warnings in places where any is needed as type
type ExplicitAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

type UUID = string;

type LocalizedString = {
  fi_FI?: string;
  sv_FI?: string;
};
