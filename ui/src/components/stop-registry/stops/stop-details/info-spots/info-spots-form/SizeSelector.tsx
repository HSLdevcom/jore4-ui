import { Listbox, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  JoreListboxButton,
  listboxStyles,
} from '../../../../../../uiComponents';
import { ItemSizeState, PosterSizeSubMenu } from '../types';
import { formatOption } from '../utils';

type SizeSelectorProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly onChange: (selectedSize: ItemSizeState) => void;
  readonly subMenus: ReadonlyArray<PosterSizeSubMenu>;
  readonly selectedItem: ItemSizeState;
  readonly testId: string;
};

export const SizeSelector: FC<SizeSelectorProps> = ({
  className,
  disabled = false,
  id,
  onChange,
  subMenus,
  selectedItem,
  testId,
}) => {
  const { t } = useTranslation();

  return (
    <Listbox
      as="div"
      className={listboxStyles.root(className)}
      disabled={disabled}
      onChange={onChange}
      value={selectedItem}
      data-testid={testId}
    >
      <JoreListboxButton id={id} testId={`${testId}::ListboxButton`}>
        {formatOption(t, selectedItem)}
      </JoreListboxButton>

      <ListboxOptions
        anchor="bottom start"
        className={listboxStyles.options()}
        data-testid={`${testId}::ListboxOptions`}
        transition
      >
        {subMenus.map(({ label, options }) => (
          <li key={label}>
            <div className="w-full cursor-default border-b border-grey bg-tweaked-brand px-2 py-2 text-white">
              {label}
            </div>
            <ul>
              {options.map((option) => (
                <ListboxOption
                  className={listboxStyles.option()}
                  key={`${option.uiState}-${option.width}-${option.height}`}
                  value={option}
                >
                  {formatOption(t, option)}
                </ListboxOption>
              ))}
            </ul>
          </li>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
