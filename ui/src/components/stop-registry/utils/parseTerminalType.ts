import { TerminalType } from '../types/TerminalType';

export function parseTerminalType(
  terminalType: string | null | undefined,
): TerminalType | undefined {
  if (terminalType === null || terminalType === undefined) {
    return undefined;
  }

  const terminalTypeValues = Object.values(TerminalType);
  if (terminalTypeValues.includes(terminalType as TerminalType)) {
    return terminalType as TerminalType;
  }

  // If no match found, return undefined
  return undefined;
}
