import { ZoneLabel } from './ZoneLabel';

const zoneLabelValues: ReadonlyArray<string> = Object.values(ZoneLabel);

// This field was previously a text input, so existing data may contain incorrect values. Fallback to unknown.
export function normalizeZoneLabel(
  value: string | null | undefined,
): ZoneLabel {
  return zoneLabelValues.includes(value as string)
    ? (value as ZoneLabel)
    : ZoneLabel.Unknown;
}
