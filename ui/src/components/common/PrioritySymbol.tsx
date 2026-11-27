import { FC } from 'react';
import { RiDraftLine } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';
import { Priority } from '../../types/enums';

type Variant = 'compact' | 'large';

export const temporaryLevelBadges: Partial<
  Record<Priority, { readonly label: string; readonly bg: string }>
> = {
  [Priority.Temporary1]: { label: '1', bg: 'bg-background-temporary-1' },
  [Priority.Temporary2]: { label: '2', bg: 'bg-background-temporary-2' },
};

const iconClasses: Partial<Record<Priority, Record<Variant, string | null>>> = {
  [Priority.Standard]: {
    compact: null,
    large: 'icon-placeholder-dot text-3xl text-light-grey',
  },
  [Priority.Temporary]: {
    compact: 'icon-temporary text-xl text-city-bicycle-yellow',
    large: 'icon-temporary-alt text-3xl text-city-bicycle-yellow',
  },
  [Priority.Draft]: {
    compact: null, // RiDraftLine, see below
    large: 'icon-draft text-3xl text-light-grey',
  },
};

type PrioritySymbolProps = {
  readonly priority?: Priority | null;
  readonly variant?: Variant;
  readonly className?: string;
  readonly title?: string;
};

export const PrioritySymbol: FC<PrioritySymbolProps> = ({
  priority,
  variant = 'compact',
  className,
  title,
}) => {
  if (!priority) {
    return null;
  }

  const a11y = title
    ? { role: 'img', 'aria-label': title, title }
    : { 'aria-hidden': true };

  const badge = temporaryLevelBadges[priority];
  if (badge) {
    return (
      <span
        {...a11y}
        className={twMerge(
          'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
          variant === 'large' ? 'h-8 w-8 text-base' : 'h-5 w-5 text-sm',
          badge.bg,
          className,
        )}
      >
        {badge.label}
      </span>
    );
  }

  if (priority === Priority.Draft && variant === 'compact') {
    return (
      <RiDraftLine
        {...a11y}
        className={twMerge('inline text-xl text-dark-grey', className)}
      />
    );
  }

  const icon = iconClasses[priority]?.[variant];
  return icon ? <i {...a11y} className={twMerge(icon, className)} /> : null;
};
