import { useMemo } from 'react';
import { useTheme } from './internal/Theme/theme';
import Icon from './Icon';
import css from './Link.module.scss';

interface Props {
  children?: React.ReactNode;
  external?: boolean; // Only used to control external link style
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
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
      <div className={css.content}>
        <span>{props.children}</span>
        {external ? <Icon name="popout" size="small" title="link" /> : null}
      </div>
    ),
    [props.children, external],
  );

  if (disabled) {
    return <span className={classes.join(' ')}>{content}</span>;
  }

  return (
    <a aria-label={href} className={classes.join(' ')} href={href} rel={rel} onClick={onClick}>
      {content}
    </a>
  );
};

export default Link;
