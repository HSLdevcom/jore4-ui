import { fireEvent, screen } from '@testing-library/react';
import { fireFullMouseClickSequence, render } from '../utils/test-utils';
import { JoreCombobox, testIds } from './JoreCombobox';

describe('<JoreCombobox />', () => {
  const testId = 'combobox1';
  const buttonContent = `button`;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onQueryChange = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};
  const options = [
    { key: 'option1', value: 'value1', render: () => 'label1' },
    { key: 'option2', value: 'value2', render: () => 'label2' },
  ];

  test('Opens dropdown when clicked', async () => {
    render(
      <JoreCombobox
        testId={testId}
        buttonContent={buttonContent}
        onChange={onChange}
        options={options}
        onQueryChange={onQueryChange}
      />,
    );

    // dropdown is collapsed:
    expect(screen.queryByText('button')).toBeVisible();
    expect(screen.queryByText('label1')).toBeNull();

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(testIds.button(testId));
    fireFullMouseClickSequence(openDropdownButton);

    // dropdown is open:
    expect(screen.queryByText('button')).toBeVisible();
    expect(screen.queryByText('label1')).toBeVisible();
  });

  test('Changes query on input', async () => {
    render(
      <JoreCombobox
        testId={testId}
        buttonContent={buttonContent}
        onChange={onChange}
        options={options}
        onQueryChange={onQueryChange}
      />,
    );

    const input = screen.getByTestId(testIds.input(testId));
    fireEvent.change(input, { target: { value: 'test' } });
    expect((input as HTMLInputElement).value).toBe('test');
  });
});
