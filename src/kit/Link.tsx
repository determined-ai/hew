import { useMemo } from 'react';

import { useTheme } from 'kit/Theme';

import Icon from './Icon';
import css from './Link.module.scss';

interface Props {
  children?: React.ReactNode;
  external?: boolean; // Only used to control external link style
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  onKeyDown?: React.KeyboardEventHandler;
  href?: string;
  rel?: string;
  disabled?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large';
}

const Link: React.FC<Props> = ({
  size,
  onClick,
  href,
  rel,
  disabled,
  external,
  onKeyDown,
  ...props
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];
  if (disabled) classes.push(css.disabled);
  if (size) classes.push(css[size]);

  const content = useMemo(
    () => (
      <>
        <span>{props.children}</span>
        {external ? <Icon name="popout" size="small" title="link" /> : null}
      </>
    ),
    [props.children, external],
  );

  if (disabled) {
    return <span className={classes.join(' ')}>{content}</span>;
  }

  return (
    <a
      aria-label={href}
      className={classes.join(' ')}
      href={href}
      rel={rel}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onKeyDown={onKeyDown}>
      {content}
    </a>
  );
};

export default Link;
