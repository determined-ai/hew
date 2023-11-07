import React from 'react';

import css from './Spin.module.scss';

interface Props {
  type: 'bowtie' | 'half' | 'shadow';
}

const Spin: React.FC<Props> = ({ type }) => {
  const classnames = [css.spinner, css[`spinner__${type}`]];
  return (
    <div className={css.base}>
      <div className={classnames.join(' ')} />
    </div>
  );
};

export const SpinBowtieComponent: React.FC = () => <Spin type="bowtie" />;
export const SpinHalfComponent: React.FC = () => <Spin type="half" />;
export const SpinShadowComponent: React.FC = () => <Spin type="shadow" />;
export const SpinBowtie = SpinBowtieComponent;
export const SpinHalf = SpinHalfComponent;
export const SpinShadow = SpinShadowComponent;

export default Spin;
