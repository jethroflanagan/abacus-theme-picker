import React, { Component } from 'react';
import _ from 'lodash';
import { toRgbCss } from '../../../utils/helpers';

import './Labeller.scss';

export class Labeller extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      // separateColors: false,
    }
  }

  render() {
    const { labels } = this.props;
    return (
      <div className="Labeller">
        {_.map(labels, label => (
        <div key={label.name} className="Labeller-legend" style={{flexGrow: label.weight}}>
          <div className="Labeller-legendLine">
            <div className="Labeller-swatch" style={{ backgroundColor: toRgbCss(label.swatch.rgb)}}></div>
            <div className="Labeller-label">{label.name}</div>
          </div>
        </div>))}
      </div>
    );
  }
}
