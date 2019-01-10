import React, { Component } from 'react';
import './AddPanel.scss';
import { toRgbCss } from '../../utils/helpers';

export class AddPanel extends Component {
  render() {
    const props = this.props;
    return (
      <div className='AddPanel' {...props}>
        <div className="AddPanel-block">
          <div className="AddPanel-symbol">+</div>
        </div>
      </div>
    );
  }
}