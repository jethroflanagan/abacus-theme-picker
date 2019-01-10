import React from 'react';
import './Swatch.scss';
import { toRgbCss } from '../../../utils/helpers';

export default (props) => {
  const { swatch, active } = props;
  const classNames = 'Swatch' + (!active ? ' Swatch--inactive' : '');
  return (
    <div className={classNames} {...props}>
      <div className="Swatch-block" style={{ backgroundColor: toRgbCss(swatch.rgb) }} />
      <div className="Swatch-info">
        <div className="Swatch-label">{swatch.name}</div>
        <div className="Swatch-hex">#{swatch.hex}</div>
      </div>
    </div>
  );
}