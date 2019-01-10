import React from 'react';
import './MainSwatch.scss';
import { toRgbCss } from '../../../utils/helpers';

export default (props) => {
  const { swatch, label } = props;
  if (!swatch) {
    return (
      <div className='MainSwatch'>
        <div className="MainSwatch-block MainSwatch-block--empty">
          <div className="MainSwatch-hint">{label}</div>
        </div>
      </div>
    );
  }
  const labelStyle = swatch.isDark 
    ? {
      color: '#aaa',
      mixBlendMode: 'screen',
    } 
    : {
      color: '#888',
      mixBlendMode: 'multiply',
    };

  return (
    <div className='MainSwatch'>
      <div className="MainSwatch-block" style={{ backgroundColor: toRgbCss(swatch.rgb) }}>
        <div className="MainSwatch-label" style={labelStyle}>{swatch.name}</div>
        <div className="MainSwatch-hex" style={labelStyle}>#{swatch.hex}</div>
        <div className="MainSwatch-hint" style={labelStyle}>{label}</div>
      </div>
    </div>
  );
}