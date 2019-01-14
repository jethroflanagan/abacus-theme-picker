import React, { Component } from 'react';
import { render } from 'react-dom';
import tinycolor  from 'tinycolor2';
import './style.scss';
import _ from 'lodash';
import { SwatchPanel } from './panels/swatch-panel/SwatchPanel';
import { PreviewPanel } from './panels/preview-panel/PreviewPanel';
import { ControlPanel } from './panels/control-panel/ControlPanel';
import { AddPanel } from './panels/add-panel/AddPanel';

const GROUPS = {
  neutrals: { name: 'Neutrals' },
  dusk: { name: 'Dusk' },
  dawn: { name: 'Dawn' },
}

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


let COLORS = [
  { name: "White", color: tinycolor({ r: 255, g: 255, b: 255 }), group: 'neutrals' },
  { name: "Silver", color: tinycolor({ r: 115, g: 100, b: 100 }), group: 'neutrals' },
  { name: "Platinum", color: tinycolor({ r: 90, g: 75, b: 75 }), group: 'neutrals' },
  { name: "Graphite", color: tinycolor({ r: 45, g: 35, b: 35 }), group: 'neutrals' },
  { name: "Black", color: tinycolor({ r: 0, g: 0, b: 0 }), group: 'neutrals' },

  { name: "Energy", color: tinycolor({ r: 255, g: 120, b: 15 }), group: 'dawn', mix: ['Prepared', 'Agile', 'Passion', 'Warmth', 'Surprise', 'Calm', 'Luxury', 'Depth'] },
  { name: "Prepared", color: tinycolor({ r: 250, g: 85, b: 30 }), group: 'dawn', mix: ['Energy', 'Passion', 'Warmth', 'Grounded', 'Calm', 'Luxury', 'Depth'] },
  { name: "Agile", color: tinycolor({ r: 245, g: 45, b: 40 }), group: 'dawn', mix: ['Energy', 'Prepared', 'Warmth', 'Human', 'Grounded', 'Calm', 'Luxury', 'Depth'] },
  { name: "Passion", color: tinycolor({ r: 220, g: 0, b: 50 }), group: 'dawn', mix: ['Energy', 'Prepared', 'Warmth', 'Human', 'Grounded', 'Care', 'Smile', 'Surprise', 'Calm', 'Luxury', 'Depth'] },
  { name: "Warmth", color: tinycolor({ r: 190, g: 0, b: 40 }), group: 'dawn', mix: ['Energy', 'Prepared', 'Agile', 'Passion', 'Grounded', 'Luxury', 'Depth'] },
  { name: "Human", color: tinycolor({ r: 170, g: 5, b: 45 }), group: 'dawn', mix: ['Agile', 'Passion', 'Luxury', 'Depth'] },
  { name: "Grounded", color: tinycolor({ r: 150, g: 5, b: 40 }), group: 'dawn', mix: ['Prepared', 'Agile', 'Passion', 'Warmth', 'Depth'] },

  { name: "Care", color: tinycolor({ r: 240, g: 90, b: 120 }), group: 'dusk', mix: ['Passion', 'Smile', 'Surprise', 'Calm', 'Luxury', 'Depth'] },
  { name: "Smile", color: tinycolor({ r: 240, g: 50, b: 90 }), group: 'dusk', mix: ['Passion', 'Care', 'Surprise', 'Calm', 'Luxury', 'Depth'] },
  { name: "Surprise", color: tinycolor({ r: 175, g: 20, b: 75 }), group: 'dusk', mix: ['Energy', 'Passion', 'Care', 'Smile', 'Calm', 'Luxury', 'Depth'] },
  { name: "Calm", color: tinycolor({ r: 135, g: 10, b: 60 }), group: 'dusk', mix: ['Energy', 'Prepared', 'Agile', 'Passion', 'Care', 'Smile', 'Surprise', 'Luxury', 'Depth'] },
  { name: "Luxury", color: tinycolor({ r: 100, g: 0, b: 50 }), group: 'dusk', mix: ['Energy', 'Prepared', 'Agile', 'Passion', 'Warmth', 'Human', 'Care', 'Smile', 'Surprise', 'Calm', 'Depth'] },
  { name: "Depth", color: tinycolor({ r: 80, g: 10, b: 40 }), group: 'dusk', mix: ['Energy', 'Prepared', 'Agile', 'Passion', 'Warmth', 'Human', 'Grounded', 'Care', 'Smile', 'Surprise', 'Calm', 'Luxury'] },
].map((item) => ({
  ...item,
  rgb: item.color.toRgb(),
  hsv: item.color.toHsv(),
  hex: item.color.toHex(),
  greyscale: item.color.greyscale().toRgb(),
  labelColor: item.color.isDark() ? '#fff': '#000',
  isDark: item.color.isDark(),
}));

COLORS.forEach((color) => {
  const group = GROUPS[color.group];
  if (!group.swatches) {
    group.swatches = [];
  }
  group.swatches.push(color);
  // return { ...color, mix: removeAround(color.name) };
});

const DAWN_DUSK_GROUPED = {
  dawn: GROUPS.dawn,
  dusk: GROUPS.dusk,
};
const DAWN_DUSK = [...DAWN_DUSK_GROUPED.dawn.swatches, ...DAWN_DUSK_GROUPED.dusk.swatches];

class App extends Component {
  constructor() {
    super();
    this.state = {
      primary: null,
      secondary: null,
      experience: null,
      numTertiary: 1,
      tertiary: [],
      cta: _.find(COLORS, { name: 'Prepared' }),
      palette: [
        {
          label: 'Primary',
          mix: DAWN_DUSK_GROUPED,
          swatch: null,
          isGrouped: true,
        },
      ],
      neutrals: GROUPS.neutrals.swatches,
    };
  }

  chooseSwatch(swatch, index) {
    const paletteNames = ['Secondary', 'Colour {{index}}'];
    let palette = [...this.state.palette];

    // remove following panels
    palette.length = Math.min(palette.length, index + 1);

    let current = palette[index];
console.log('current', swatch.mix);
    const currentMix = palette.length === 1 ? DAWN_DUSK : current.mix;
    const swatchMix = swatch.mix.filter(name => _.find(currentMix, { name }));

    const mix = swatchMix.map((name) => _.find(DAWN_DUSK, { name }));

    // handle deselect
    if (current.name === swatch.name) {
      palette.pop();
    }
    else {
      current.swatch = swatch;
      let label = index < paletteNames.length ? paletteNames[index] : paletteNames.slice(-1)[0];
      label = label.replace('{{index}}', palette.length - paletteNames.length + 1);
      current = {
        label,
        isGrouped: false,
        // convert to swatches
        mix,
        swatch: null,
      };

      if (mix.length) {
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

  addTertiary() {
    this.setState({ numTertiary: this.state.numTertiary + 1 });
  }

  changeExperience(experience) {
    // just use name refs
    let neutrals = [...GROUPS.neutrals.swatches].map(swatch => swatch.name);
    switch (experience) {
      case 'Transactional':
        neutrals = ['White', 'Platinum'];
        break;
      case 'Tool':
        neutrals = ['White', 'Silver', 'Graphite', 'Black'];
        break;
      case 'Retail':
        neutrals = ['White', 'Silver'];
        break;
      default:
    }
    // convert to swatches
    neutrals = _.map(neutrals, name => _.find(COLORS, { name }));
    this.setState({ experience, neutrals });
  }


  createSwatchPanel({ label, mix, onChanged, isGrouped, swatch }) {
    return <SwatchPanel key={'Swatch ' + label} list={mix} label={label} onActiveChanged={(...args) => onChanged(...args)} grouped={isGrouped} swatch={swatch} />
  }

  render() {
    const { palette, cta } = this.state;
    console.log(palette);

    const ctaPanel = this.createSwatchPanel({ label: 'Call to action', mix: DAWN_DUSK_GROUPED, isGrouped: true, onChanged: ()=>{}, swatch: cta });

    let canAddPanels = false;
    const panels = palette.map((panel, index) => {
      const onChanged = (swatch) => this.chooseSwatch(swatch, index);
      return this.createSwatchPanel({ label: panel.label, mix: panel.mix, onChanged, isGrouped: panel.isGrouped })
    });


    return (
      <div className="App">
        <ControlPanel onChange={name => this.changeExperience(name)} />
        {ctaPanel}
        {panels}
        {canAddPanels ? <AddPanel onClick={() => this.addTertiary()} /> : null }
        {/* <PreviewPanel primary={palette[0]} secondary={null} tertiaryList={palette.slice(2)} neutralList={[]}/> */}
        {/* <ExportPanel /> */}

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
