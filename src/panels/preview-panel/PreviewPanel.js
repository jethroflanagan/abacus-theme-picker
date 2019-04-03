import React, { Component } from 'react';
import _ from 'lodash';
import { ExportControls } from './components/ExportControls';
import { Labeller } from './components/Labeller';
import { Logo } from 'src/components/logo/Logo';
import { downloadImage } from 'src/utils/export';
import { toRgbCss } from '../../utils/helpers';
import { PREVIEW_WEIGHTS } from '../../config';
import FullScreenAsset from '../../assets/fullscreen.png';
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
      color: 'rba(255,255,255,.8)',
      // mixBlendMode: 'screen',
    }
    : {
      color: 'rgba(0,0,0,.8)',
      // mixBlendMode: 'multiply',
    }
    return (
      <div className='PalettePreview-swatch' style={{ background: toRgbCss(swatch.rgb), flexGrow: weight}} key={swatch.name}>
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
    }).filter(item => item); // remove null
    if (list.length === 0) {
      return <div className='PalettePreview-swatchPlaceholder' key='placeholder' />
    }
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

  toggleFullMode() {
    this.props.toggleFullMode();
  }

  async getImageData(el) {
    // HACK: add print mode without re-rendering react
    const appEl = document.querySelector('.App');
    appEl.classList.add('App--print');

    // allow people to read message
    await new Promise(resolve => setTimeout(() => resolve(), 300))

    await downloadImage({ el, filename: 'chroma-palette' });

    appEl.classList.remove('App--print');
    // appEl.classList.add('App--print-settle');
    // setTimeout(() => {
    //   appEl.classList.remove('App--print-settle');
    // }, 3000);
  }

  render() {
    const { palette, cta, neutrals, isFullMode, isSlim } = this.props;
    const { separateColors, isMenuVisible } = this.state;

    let ctaItem = null;
    let ctaBackground = null;
    const ctaConfig = { weight: PREVIEW_WEIGHTS.cta, name: 'Call to action' };
    if (cta) {
      ctaBackground = this.createSwatch(cta, ctaConfig);
      ctaItem = this.createSwatch(cta, ctaConfig);
    }

    return (
      <div className="PalettePreview">
        {/* <button onClick={() => this.getImageData(this.refs.previewEl)} download="chroma-palette.png">DOWN</button> */}

        {isFullMode ? <div className="PalettePreview-logo"><Logo /></div> : null }
        <div className={`FullModeToggle`} onClick={() => this.toggleFullMode()}><img src={FullScreenAsset} /></div>
        <div className={`PaddingToggle ${separateColors ? ' PaddingToggle--gap': ''}`} onClick={() => this.setSeparateColors(!separateColors)}>
          <div className="PaddingToggle-pane"/>
          <div className="PaddingToggle-pane"/>
          <div className="PaddingToggle-pane"/>
          <div className="PaddingToggle-label">{ separateColors ? 'Hide gap' : 'Show gap' }</div>
        </div>
        <div className="PalettePreview-bk">
          <div className="PalettePreview-bkColors" style={{ flexGrow: PREVIEW_WEIGHTS.palette }}>
            { this.createList(palette) }
          </div>
          <div className="PalettePreview-bkNeutrals" style={{ flexGrow: PREVIEW_WEIGHTS.neutrals - 6 }}>
            {/* { neutralList ? this.createList({ palette: neutralList, weights: { default: 1 } }) : null } */}
          </div>
          <div className="PalettePreview-bkCta" style={{ flexGrow: PREVIEW_WEIGHTS.cta + 6 }}>
            { ctaBackground }
          </div>
        </div>
        <div className="PalettePreview-margin" style={{marginRight: 'auto'}} />

        <div ref="previewEl" className="PalettePreview-image">
          <div className="PalettePreview-logo PalettePreview-logo--image"><Logo /></div>
          <div  className={`PalettePreview-card ${separateColors ? ' PalettePreview-card--padded' : ''} ${isSlim && !isFullMode ? 'PalettePreview-card--slim' : ''}`}>
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
        </div>
        <ExportControls setSeparateColors={val => this.setSeparateColors(val)} changeVisibility={(val) => this.changeMenuVisibility(val)} exportImage={() => this.getImageData(this.refs.previewEl)} />
        <div className="PalettePreview-margin" style={{marginLeft: 'auto', width: '200px'}}>
        </div>
      </div>
    );
  }
}
