import React from 'react';
import './EmptySwatchHeader.scss';

export default (props) => {
  return (
    <div className="EmptySwatchHeader" {...props}>
        <div className="EmptySwatchHeader-plus">+</div>
        <div className="EmptySwatchHeader-hint">{props.label}</div>
    </div>
  );
}
