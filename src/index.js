import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';
import _ from 'lodash';
import { SwatchPanel } from './panels/swatch-panel/SwatchPanel';
import { PreviewPanel } from './panels/preview-panel/PreviewPanel';
import { ControlPanel } from './panels/control-panel/ControlPanel';
import { AddPanel } from './panels/add-panel/AddPanel';

import {
  COLORS,
  NEUTRALS,
  GROUPS,
  CALL_TO_ACTION,
  CALL_TO_ACTION_EMAIL,
  NEUTRALS_WEIGHTS,
  PALETTE_WEIGHTS,
  DAWN_DUSK,
  DAWN_DUSK_GROUPED
} from './config';

class App extends Component {
  constructor() {
    super();
    this.state = {
      primary: null,
      secondary: null,
      experience: 'RetailWeb',
      numTertiary: 1,
      tertiary: [],
      cta: _.find(CALL_TO_ACTION, { name: 'Prepared' }),
      hideFinalPanel: false,
      palette: [
        {
          name: 'Primary',
          mix: DAWN_DUSK_GROUPED,
          swatch: null,
          isGrouped: true,
        },
      ],
    };
    document.documentElement.style.setProperty('--primary-color', '#' + this.state.cta.hex);
  }

  chooseSwatch(swatch, index) {
    const paletteNames = ['Secondary', 'Colour {{index}}'];
    let palette = [...this.state.palette];

    // remove following panels
    palette.length = Math.min(palette.length, index + 1);
    let current = palette[index];
    const currentMix = palette.length === 1 ? DAWN_DUSK : current.mix;
    const swatchMix = swatch.mix.filter(name => _.find(currentMix, { name }));

    const mix = swatchMix.map((name) => _.find(DAWN_DUSK, { name }));

    // handle deselect
    if (current.name === swatch.name) {
      palette.pop();
    }
    else {
      current.swatch = swatch;
      let name = index < paletteNames.length ? paletteNames[index] : paletteNames.slice(-1)[0];
      name = name.replace('{{index}}', palette.length - paletteNames.length + 1);
      current = {
        name,
        isGrouped: false,
        // convert to swatches
        mix,
        swatch: null,
      };

      if (palette.length < 5 && mix.length) {
        palette.push(current);
      }
    }

    // palette = _.map(COLORS, name => _.find(COLORS, { name }))

    this.setState({ palette });
  }

  chooseCta(swatch) {
    this.setState({ cta: swatch });
    // change theme
    document.documentElement.style.setProperty('--primary-color', '#' + swatch.hex);
  }

  changeExperience(experience) {
    this.setState({ experience });
  }

  createSwatchPanel({ name, mix, onChanged, isGrouped, swatch, canRemove, isSlim }) {
    return <SwatchPanel key={'Swatch ' + name} list={mix} label={name} onActiveChanged={(...args) => onChanged(...args)} grouped={isGrouped} swatch={swatch} canRemove={canRemove} removePanel={() => this.removePanel()} slim={isSlim} />
  }

  removePanel() {
    this.setState({ hideFinalPanel: true });
  }
  allowAddingPanels() {
    this.setState({ hideFinalPanel: false });
  }

  render() {
    const { palette, cta, experience, hideFinalPanel } = this.state;

    const ctaPanel = this.createSwatchPanel({ name: 'Call to action', mix: (experience === 'Emailer' ? CALL_TO_ACTION_EMAIL: CALL_TO_ACTION), onChanged: swatch => this.chooseCta(swatch), swatch: cta, isSlim: palette.length > 3 });

    let canAddPanels = false;
    const panels = palette.map((panel, index, list) => {
      const onChanged = (swatch) => this.chooseSwatch(swatch, index);
      let canRemove = false;
      if (index > 0 && index === list.length - 1) {
        canRemove = true;
      }
      return this.createSwatchPanel({ name: panel.name, mix: panel.mix, onChanged, isGrouped: panel.isGrouped, canRemove, isSlim: list.length > 3 })
    });
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
    if (hideFinalPanel) {
      panels.pop();
    }

    // const neutralList = _.map(neutrals, name => _.find(COLORS, { name }));
    return (
      <div className="App">
        <ControlPanel onChange={name => this.changeExperience(name)} experience={experience} />
        {ctaPanel}
        {panels}
        {canAddPanels ? <AddPanel onClick={() => this.addTertiary()} /> : null }
        {hideFinalPanel ? <AddPanel onClick={() => this.allowAddingPanels()} /> : null}
        <PreviewPanel palette={weightedPalette} neutrals={weightedNeutrals} cta={cta} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
