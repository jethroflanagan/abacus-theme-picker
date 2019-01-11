import React, { Component } from 'react';
import _ from 'lodash';
import { ExportControls } from './components/ExportControls';

import { toRgbCss } from '../../utils/helpers';
import './PreviewPanel.scss';

export class PreviewPanel extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      active: null,
      tertiaryList: [],
      separateColors: false,
    }
  }

  createSwatch(swatch, { weight = 1, label = '' } = {}) {
    const labelStyle = swatch.isDark
    ? {
      color: '#aaa',
      mixBlendMode: 'screen',
    } 
    : {
      color: '#888',
      mixBlendMode: 'multiply',
    }
    return (
      <div className='PalettePreview-swatch' style={{ backgroundColor: toRgbCss(swatch.rgb), flexGrow: weight}} key={swatch.name}>
        <div className="PalettePreview-swatchLabel" style={labelStyle}>{label}</div>
      </div>
    )
  }

  setSeparateColors(separateColors) {
    this.setState({ separateColors })
  }

  render() {
    const { primary, secondary, tertiaryList, neutralList } = this.props;
    const {separateColors} = this.state;
    return (
      <div className="PalettePreview">
        <div className="PalettePreview-bk">

          {primary ? this.createSwatch(primary, { weight: 5 }) : null}
          {secondary ? this.createSwatch(secondary, { weight: 3 }) : null}
          {tertiaryList ? _.map(tertiaryList, swatch => this.createSwatch(swatch, { weight: 1 })) : null}
          {neutralList ? _.map(neutralList, swatch => this.createSwatch(swatch, { weight: 1 })) : null}
        </div>
        <div className="PalettePreview-margin" style={{marginRight: 'auto'}} />
        <div className={'PalettePreview-card' + (separateColors ? ' PalettePreview-card--padded' : '')}>

          {primary ? this.createSwatch(primary, { weight: 10, label: primary.name }) : null}
          {secondary ? this.createSwatch(secondary, { weight: 5, label: secondary.name }) : null}
          {tertiaryList ? _.map(tertiaryList, swatch => this.createSwatch(swatch, { weight: 0, label: swatch.name })) : null}
          {neutralList ? _.map(neutralList, swatch => this.createSwatch(swatch, { weight: 2, label: swatch.name })) : null}
        </div>
        <div className="PalettePreview-margin" style={{marginLeft: 'auto'}}>
          <ExportControls setSeparateColors={val => this.setSeparateColors(val)} />
        </div>
      </div>
    );
  }
}
