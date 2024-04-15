import { screen } from '@testing-library/react';
import { render } from '../../../../utils/test-utils';
import { MainLineWarning } from './MainLineWarning';

describe('MainLineWarning', () => {
  test('should not show the warning when stop is not a main line stop and has no main line sign', async () => {
    render(<MainLineWarning isMainLineStop={false} hasMainLineSign={false} />);

    const warning = screen.queryByTestId('MainLineWarning::warning');
    expect(warning).not.toBeInTheDocument();
  });

  test('should not show the warning when main line stop has a main line sign', async () => {
    render(<MainLineWarning isMainLineStop hasMainLineSign />);

    const warning = screen.queryByTestId('MainLineWarning::warning');
    expect(warning).not.toBeInTheDocument();
  });

  test('should show warning when main line stop has no main line sign', async () => {
    render(<MainLineWarning isMainLineStop hasMainLineSign={false} />);

    const warning = screen.queryByTestId('MainLineWarning::warning');
    expect(warning).toBeInTheDocument();
    expect(warning).toBeVisible();
  });

  test('should show warning when a stop with main line sign is not a main line stop', async () => {
    render(<MainLineWarning isMainLineStop={false} hasMainLineSign />);

    const warning = screen.queryByTestId('MainLineWarning::warning');
    expect(warning).toBeInTheDocument();
    expect(warning).toBeVisible();
  });
});
