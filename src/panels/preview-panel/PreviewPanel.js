import React, { Component } from 'react';
import _ from 'lodash';
import { ExportControls } from './components/ExportControls';
import { Labeller } from './components/Labeller';

import { toRgbCss } from '../../utils/helpers';
import { PREVIEW_WEIGHTS } from '../../config';
import './PreviewPanel.scss';

export class PreviewPanel extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      active: null,
      separateColors: false,
      isMenuVisible: false,
    }
  }

  createSwatch(swatch, { weight = 1 }) {
    const nameStyle = swatch.isDark
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
        {/* { showLabel ? <div className="PalettePreview-swatchLabel" style={nameStyle}>{name}</div> : null } */}
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

  changeMenuVisibility(isMenuVisible) {
    this.setState({ isMenuVisible });
  }

  render() {
    const { palette, cta, neutrals } = this.props;
    const { separateColors, isMenuVisible } = this.state;

    let ctaItem = null;
    let ctaBackground = null;
    const ctaConfig = { weight: PREVIEW_WEIGHTS.cta, name: 'Call to action' };
    if (cta) {
      ctaBackground = this.createSwatch(cta, ctaConfig);
      ctaItem = this.createSwatch(cta, ctaConfig);
    }
    console.log(isMenuVisible);
    return (
      <div className="PalettePreview">
        <div className="PalettePreview-bk">
          <div className="PalettePreview-bkColors" style={{ flexGrow: PREVIEW_WEIGHTS.palette }}>
            { this.createList(palette) }
          </div>
          <div className="PalettePreview-bkNeutrals" style={{ flexGrow: PREVIEW_WEIGHTS.neutrals }}>
            {/* { neutralList ? this.createList({ palette: neutralList, weights: { default: 1 } }) : null } */}
          </div>
          <div className="PalettePreview-bkCta" style={{ flexGrow: PREVIEW_WEIGHTS.cta }}>
            { ctaBackground }
          </div>
        </div>
        <div className="PalettePreview-margin" style={{marginRight: 'auto'}} />
        <div className={'PalettePreview-card' + (separateColors ? ' PalettePreview-card--padded' : '')}>
          <div className="PalettePreview-cardColors" style={{ flexGrow: PREVIEW_WEIGHTS.palette }}>
            { this.createList(palette) }
          </div>
          <div className="PalettePreview-cardNeutrals" style={{ flexGrow: PREVIEW_WEIGHTS.neutrals }}>
            { neutrals ? this.createList(neutrals) : null }
          </div>
          <div className="PalettePreview-cardCta" style={{ flexGrow: PREVIEW_WEIGHTS.cta }}>
          { ctaItem }
          </div>
          <div className={'PalettePreview-labels' + (isMenuVisible ? '' : ' PalettePreview-labels--visible')}>
            <Labeller palette={palette} cta={{swatch: cta, ...ctaConfig}} neutrals={neutrals} />
          </div>
        </div>
        <div className="PalettePreview-margin" style={{marginLeft: 'auto'}}>
          <ExportControls setSeparateColors={val => this.setSeparateColors(val)} changeVisibility={(val) => this.changeMenuVisibility(val)}/>
        </div>
      </div>
    );
  }
}
