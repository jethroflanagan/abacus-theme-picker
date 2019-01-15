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
  NEUTRALS_WEIGHTS,
  PALETTE_WEIGHTS,
  DAWN_DUSK,
  DAWN_DUSK_GROUPED
} from './config';

// remove colours that are preceptually nearby each other using a naiive method
// function removeAround(name, list) {
//   const dusk = _.filter(list, name => _.find(GROUPS.dusk.swatches, { name }));
//   const dawn = _.filter(list, name => _.find(GROUPS.dawn.swatches, { name }));

//   // use sparse arrays as position is important in removal
//   const sparseDusk = Array(7);
//   _.map(dusk, name => {
//     let index = _.findIndex(GROUPS.dusk.swatches, { name });
//     // match dusk and dawn palette contrasts and indexes with a gap after "Care"
//     if (index > 0) index++;
//     sparseDusk[index] = name;
//   });

//   const sparseDawn = Array(7);
//   _.map(dawn, name => {
//     let index = _.findIndex(GROUPS.dawn.swatches, { name });
//     sparseDawn[index] = name;
//   });

//   let startFrom = sparseDawn.indexOf(name);
  
//   // if not in dawn, try dusk
//   if (startFrom === -1) {
//     startFrom = sparseDusk.indexOf(name);
//   }

//   // start a position back
//   startFrom--;
//   const removeAmount = Math.min(3, startFrom + 3);

//   let filtered = [sparseDawn, sparseDusk].map(list => {
//     list.splice(Math.max(startFrom, 0), removeAmount);
//     return list;
//   });
//   filtered = _.flatten(filtered);
//   // remove undefined (from sparse array)
//   filtered = _.filter(filtered, name => name);

//   return  filtered;
// }


// const NEUTRALS = [
//   'Transactional': [
//     { name: "White", color: tinycolor({ r: 255, g: 255, b: 255 }), group: 'neutrals' },

//   ]
// ]


class App extends Component {
  constructor() {
    super();
    this.state = {
      primary: null,
      secondary: null,
      experience: 'TransactionalWeb',
      numTertiary: 1,
      tertiary: [],
      cta: _.find(COLORS, { name: 'Prepared' }),
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
    // if primary, change theme
    if (index === 0) {
      document.documentElement.style.setProperty('--primary-color', '#' + swatch.hex);
    }

    // palette = _.map(COLORS, name => _.find(COLORS, { name }))

    this.setState({ palette });
  }

  chooseCta(swatch) {
    this.setState({ cta: swatch });
  }

  changeExperience(experience) {
    this.setState({ experience });
  }

  createSwatchPanel({ name, mix, onChanged, isGrouped, swatch }) {
    return <SwatchPanel key={'Swatch ' + name} list={mix} label={name} onActiveChanged={(...args) => onChanged(...args)} grouped={isGrouped} swatch={swatch} />
  }

  render() {
    const { palette, cta, experience } = this.state;

    const ctaPanel = this.createSwatchPanel({ name: 'Call to action', mix: CALL_TO_ACTION, onChanged: swatch => this.chooseCta(swatch), swatch: cta });

    let canAddPanels = false;
    const panels = palette.map((panel, index) => {
      const onChanged = (swatch) => this.chooseSwatch(swatch, index);
      return this.createSwatchPanel({ name: panel.name, mix: panel.mix, onChanged, isGrouped: panel.isGrouped })
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
      name: item.swatch.name,
      weight: neutrals[i].weight,
    }));
    // const neutralList = _.map(neutrals, name => _.find(COLORS, { name }));
    return (
      <div className="App">
        <ControlPanel onChange={name => this.changeExperience(name)} experience={experience} />
        {ctaPanel}
        {panels}
        {canAddPanels ? <AddPanel onClick={() => this.addTertiary()} /> : null }
        <PreviewPanel palette={weightedPalette} neutrals={weightedNeutrals} cta={cta} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
