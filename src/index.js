import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { CALL_TO_ACTION, DAWN_DUSK, DAWN_DUSK_GROUPED, GROUPS, NEUTRALS_WEIGHTS, PALETTE_WEIGHTS } from './config';
import { ControlPanel } from './panels/control-panel/ControlPanel';
import { PreviewPanel } from './panels/preview-panel/PreviewPanel';
import { SwatchPanel } from './panels/swatch-panel/SwatchPanel';
import './style.scss';


class App extends Component {
  constructor() {
    super();
    this.state = {
      primary: null,
      secondary: null,
      experience: 'RetailWeb',
      numTertiary: 1,
      tertiary: [],
      cta: null,
      isLastPanelHidden: false,
      isFullMode: false,
      palette: [
        {
          name: 'Primary',
          mix: DAWN_DUSK_GROUPED,
          swatch: null,
          isGrouped: true,
        },
      ],
    };
  }

  chooseSwatch(swatch, index) {
    const paletteNames = ['Secondary', 'Colour {{index}}'];
    let palette = [...this.state.palette];

    palette.length = Math.min(palette.length, index + 1);
    const lastPanel = palette.slice(-1)[0];
    if (lastPanel && lastPanel.swatch) {
      palette[palette.length - 1].swatch = null;
    }

    let current = palette[index];
    const currentMix = palette.length === 1 ? DAWN_DUSK : current.mix;
    const swatchMix = swatch.mix.filter(name => _.find(currentMix, { name }));

    const mix = swatchMix.map((name) => _.find(DAWN_DUSK, { name }));

    current.swatch = swatch;
    let name = index < paletteNames.length ? paletteNames[index] : paletteNames.slice(-1)[0];
    name = name.replace('{{index}}', palette.length - paletteNames.length + 1);
    current = {
      name,
      isGrouped: false,
      mix,
      swatch: null,
    };

    if (palette.length < 5 && mix.length) {
      palette.push(current);
    }
    // Primary choice affects CTA
    let cta = this.state.cta;
    if (index === 0) {
      const result = this.getCtaFromPrimary(swatch);
      palette[0].isGrouped = false;
      palette[0].mix = result.mix;
      cta = result.cta;
    }
    this.setState({ palette, cta, isLastPanelHidden: false }, () => {
      if (cta) {
        this.setPageThemeAsCta();
      }
    });
  }

  chooseCta(swatch) {
    this.setState({ cta: swatch });

    let mix = [];
    switch (swatch.name) {
      case 'Prepared':
        mix = GROUPS.dusk.swatches;
        break;
      case 'Smile':
        mix = GROUPS.dawn.swatches;
    }

    // reset palette for primary to opposite of cta
    this.setState({
      palette: [{
        name: 'Primary',
        mix,
        swatch: null,
        isGrouped: false,
      }]
    }, () => {
      this.setPageThemeAsCta();
    });
  }

  get isSlim() {
    const { palette, isLastPanelHidden } = this.state;
    return palette.length + (isLastPanelHidden ? -1 : 0) > 3;
  }

  getCtaFromPrimary(primary) {
    let ctaName;
    let mix;
    if (_.find(GROUPS.dusk.swatches, { name: primary.name })) {
      ctaName = 'Prepared';
      mix = GROUPS.dusk.swatches;
    }
    else {
      ctaName = 'Smile';
      mix = GROUPS.dawn.swatches;
    }
    return {
      cta: _.find(CALL_TO_ACTION, { name: ctaName }),
      mix,
    };
  }

  setPageThemeAsCta() {
    document.documentElement.style.setProperty('--primary-color', '#' + this.state.cta.hex);
  }

  changeExperience(experience) {
    this.setState({ experience });
  }

  // TODO: cleanup and simplify
  createPanels() {
    const { palette, isLastPanelHidden, cta } = this.state;
    const isSlim = this.isSlim;
    const ctaPanel = this.createSwatchPanel({ name: 'Call to action', mix: CALL_TO_ACTION, onChanged: swatch => this.chooseCta(swatch), swatch: cta, isSlim });

    const panels = palette.map((panel, index, list) => {
      const onChanged = (swatch) => this.chooseSwatch(swatch, index);
      let canRemove = false;
      let canHide = false;
      if (index > 0 && index === list.length - 1) {
        canHide = true;
      }
      else if (isLastPanelHidden && index === list.length - 2 && index > 0) {
        canRemove = true;
      }
      let isShowIncluded = false;
      if (isLastPanelHidden && index === list.length - 2) {
        isShowIncluded = true;
      }
      return this.createSwatchPanel({ name: panel.name, mix: panel.mix, onChanged, isGrouped: panel.isGrouped, canRemove, canHide, isSlim, isShowIncluded })
    });

    if (isLastPanelHidden && palette.length > 1) {
      panels.pop();
    }
    return [ctaPanel, ...panels];
  }

  createSwatchPanel({ name, mix, onChanged, isGrouped, swatch, canRemove, canHide, isShowIncluded }) {
    const isSlim = this.isSlim;
    const removeCb = canHide
      ? () => this.hideLastPanel()
      : () => this.removeLastPanel();
    return <SwatchPanel key={'Swatch ' + name} list={mix} label={name} onActiveChanged={(...args) => onChanged(...args)} grouped={isGrouped} swatch={swatch} canRemove={canRemove || canHide} removePanel={removeCb} slim={isSlim} showNextPanel={isShowIncluded ? () => this.showLastPanel(): null} />
  }

  hideLastPanel() {
    this.setState({ isLastPanelHidden: true });
  }
  removeLastPanel() {
    const palette = this.state.palette;
    palette.pop();
    this.setState({ palette });
  }

  showLastPanel() {
    this.setState({ isLastPanelHidden: false });
  }

  toggleFullMode () {
    this.setState({ isFullMode: !this.state.isFullMode });
  }


  render() {
    const { palette, cta, experience, isFullMode } = this.state;
    const isSlim = this.isSlim;

    const panels = this.createPanels();

    const numSwatches = palette.filter(item => item.swatch).length;

    const weights = numSwatches > 0 ? PALETTE_WEIGHTS[numSwatches] : PALETTE_WEIGHTS[1];

    const weightedPalette = palette.map((item, i) => ({
      ...item,
      name: item.name,
      weight: weights[i],
    }));
    const neutrals = NEUTRALS_WEIGHTS[experience];
    const weightedNeutrals = neutrals.map((item, i) => ({
      ...item,
      name: item.swatch.hint,
      weight: neutrals[i].weight,
    }));

    const classNames = !cta ? 'App--no-primary' : '';

    // const neutralList = _.map(neutrals, name => _.find(COLORS, { name }));
    return (
      <div className={`App ${classNames}`}>
        <div className={`App-panels ${isFullMode ? 'App-panels--hidden' : ''}`}>
          <ControlPanel onChange={name => this.changeExperience(name)} experience={experience} />
          {panels}
        </div>
        <PreviewPanel palette={weightedPalette} neutrals={weightedNeutrals} cta={cta} toggleFullMode={()=>this.toggleFullMode()} isFullMode={isFullMode} isSlim={isSlim} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
