import React, { Component } from 'react';
import _ from 'lodash';
import { ExportControls } from './components/ExportControls';
import { Labeller } from './components/Labeller';

import { toRgbCss } from '../../utils/helpers';
import './PreviewPanel.scss';

export class PreviewPanel extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      active: null,
      separateColors: false,
    }
  }

  createSwatch(swatch, { weight = 1, name = '', showLabel = true }) {
    const nameStyle = swatch.isDark
    ? {
      color: '#aaa',
      mixBlendMode: 'screen',
    }
    : {
      color: '#888',
      mixBlendMode: 'multiply',
    }
    console.log(showLabel);
    return (
      <div className='PalettePreview-swatch' style={{ backgroundColor: toRgbCss(swatch.rgb), flexGrow: weight}} key={swatch.name}>
        { showLabel ? <div className="PalettePreview-swatchLabel" style={nameStyle}>{name}</div> : null }
      </div>
    )
  }

  setSeparateColors(separateColors) {
    this.setState({ separateColors })
  }

  createList(palette, options) {
    const list = _.map(palette, (item, i) => {
      const { name, swatch } = item;
      if (!swatch) return null;
      let weight = item.weight;
      if (!weight) weight = 0;
      return this.createSwatch(swatch, { ...options, weight, name });
    });

    return list;
  }

  // createBasicList({ swatches, weights }) {
  //   const list = _.map(swatches, (swatch, i) => {
  //     if (!swatch) return null;
  //     const { name } = swatch;
  //     let weight = weights[i];
  //     if (!weight) weight = 1;
  //     return this.createSwatch(swatch, { weight, name });
  //   });

  //   return list;
  // }

  render() {
    const { palette, cta, neutrals } = this.props;
    const {separateColors} = this.state;
    console.log(palette, neutrals);

    let ctaItem = null;
    let ctaBackground = null;
    if (cta) {
      ctaBackground = this.createSwatch(cta, { weight: 1, name: 'Call to action' });
      ctaItem = this.createSwatch(cta, { weight: 1, name: 'Call to action' });
    }

    return (
      <div className="PalettePreview">
        <div className="PalettePreview-bk">
          <div className="PalettePreview-bkColors">
            { this.createList(palette) }
          </div>
          <div className="PalettePreview-bkNeutrals">
            {/* { neutralList ? this.createList({ palette: neutralList, weights: { default: 1 } }) : null } */}
          </div>
          <div className="PalettePreview-bkCta">
            { ctaBackground }
          </div>
        </div>
        <div className="PalettePreview-margin" style={{marginRight: 'auto'}} />
        <div className={'PalettePreview-card' + (separateColors ? ' PalettePreview-card--padded' : '')}>
          <div className="PalettePreview-cardColors">
            { this.createList(palette) }
          </div>
          <div className="PalettePreview-cardNeutrals">
            { neutrals ? this.createList(neutrals, { showLabel: false }) : null }
            <Labeller labels={neutrals} style={{}}/>
          </div>
          <div className="PalettePreview-cardCta">
          { ctaItem }
          </div>
        </div>
        <div className="PalettePreview-margin" style={{marginLeft: 'auto'}}>
          <ExportControls setSeparateColors={val => this.setSeparateColors(val)} />
        </div>
      </div>
    );
  }
}
