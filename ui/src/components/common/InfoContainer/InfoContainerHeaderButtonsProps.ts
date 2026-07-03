import { InfoContainerControls } from './InfoContainerControls';

export type InfoContainerHeaderButtonsProps = {
  readonly controls: InfoContainerControls;
  readonly testIdPrefix: string;
  readonly ariaLabel?: string;
  readonly inverted?: boolean;
};
