import React, { Component } from 'react';
import { render } from 'react-dom';
import tinycolor  from './tinycolor';
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
function removeAround(name, list) {
  const dusk = _.filter(list, name => _.find(GROUPS.dusk.swatches, { name }));
  const dawn = _.filter(list, name => _.find(GROUPS.dawn.swatches, { name }));
  
  // use sparse arrays as position is important in removal
  const sparseDusk = Array(7);
  _.map(dusk, name => {
    let index = _.findIndex(GROUPS.dusk.swatches, { name });
    // match dusk and dawn palette contrasts and indexes with a gap after "Care"
    if (index > 0) index++;
    sparseDusk[index] = name;
  });

  const sparseDawn = Array(7);
  _.map(dawn, name => {
    let index = _.findIndex(GROUPS.dawn.swatches, { name });
    sparseDawn[index] = name;
  });

  let startFrom = sparseDawn.indexOf(name);
  
  // if not in dawn, try dusk
  if (startFrom === -1) {
    startFrom = sparseDusk.indexOf(name);
  } 

  // start a position back
  startFrom--;
  const removeAmount = Math.min(3, startFrom + 3);

  let filtered = [sparseDawn, sparseDusk].map(list => {
    list.splice(Math.max(startFrom, 0), removeAmount);
    return list;
  });
  filtered = _.flatten(filtered);
  // remove undefined (from sparse array)
  filtered = _.filter(filtered, name => name);
  
  return  filtered;
}


let COLORS = [
  { name: "White", color: tinycolor({ r: 255, g: 255, b: 255 }), group: 'neutrals' },
  { name: "Silver", color: tinycolor({ r: 115, g: 100, b: 100 }), group: 'neutrals' },
  { name: "Platinum", color: tinycolor({ r: 90, g: 75, b: 75 }), group: 'neutrals' },
  { name: "Graphite", color: tinycolor({ r: 45, g: 35, b: 35 }), group: 'neutrals' },
  { name: "Black", color: tinycolor({ r: 0, g: 0, b: 0 }), group: 'neutrals' },

  { name: "Energy", color: tinycolor({ r: 255, g: 120, b: 15 }), group: 'dawn' }, 
  { name: "Prepared", color: tinycolor({ r: 250, g: 85, b: 30 }), group: 'dawn' },
  { name: "Agile", color: tinycolor({ r: 245, g: 45, b: 40 }), group: 'dawn' },
  { name: "Passion", color: tinycolor({ r: 220, g: 0, b: 50 }), group: 'dawn' },
  { name: "Warmth", color: tinycolor({ r: 190, g: 0, b: 40 }), group: 'dawn' },
  { name: "Human", color: tinycolor({ r: 170, g: 5, b: 45 }), group: 'dawn' },
  { name: "Grounded", color: tinycolor({ r: 150, g: 5, b: 40 }), group: 'dawn' },

  { name: "Care", color: tinycolor({ r: 240, g: 90, b: 120 }), group: 'dusk' },
  { name: "Smile", color: tinycolor({ r: 240, g: 50, b: 90 }), group: 'dusk' },
  { name: "Surprise", color: tinycolor({ r: 175, g: 20, b: 75 }), group: 'dusk' },
  { name: "Calm", color: tinycolor({ r: 135, g: 10, b: 60 }), group: 'dusk' },
  { name: "Luxury", color: tinycolor({ r: 100, g: 0, b: 50 }), group: 'dusk' },
  { name: "Depth", color: tinycolor({ r: 80, g: 10, b: 40 }), group: 'dusk' },
].map((item) => ({
  ...item,
  rgb: item.color.toRgb(),
  hsv: item.color.toHsv(),
  hex: item.color.toHex(),
  greyscale: item.color.greyscale().toRgb(),
  labelColor: item.color.isDark() ? '#fff': '#000',
  isDark: item.color.isDark(),
  // mix: removeAround(item.name),
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

DAWN_DUSK.forEach((swatch) => {
  swatch.mix = removeAround(swatch.name, DAWN_DUSK.map(s => s.name));
});

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
    const palette = [...this.state.palette];
    
    // remove following panels
    palette.length = index + 1;

    // palette[index] = {
    //   label: 
    //   swatch,
    // };
    const current = palette[index];
    
    let mix = swatch.mix.map((name) => _.find(COLORS, { name }));
    console.log(mix);
    // handle deselect
    if (current.name === swatch.name) {
      palette.pop();
    }
    else {
      current.swatch = swatch;
      palette.push({
        label: 'Colour ' + palette.length,
        mix: swatch.mix,
        swatch: null,
      })
    }

    // if primary, change theme
    if (index === 0) {
      document.documentElement.style.setProperty('--primary-color', '#' + swatch.hex);
    }
    
    this.setState({ palette });
  }
  // changeTertiary(swatch, index = 0) {
  //   let { numTertiary } = this.state;
  //   const tertiary = _.clone(this.state.tertiary);
  //   let mix = [];
  //   // handle deslect  
  //   if (tertiary[index] && swatch.name === tertiary[index].name) {
  //     tertiary.length = index;
  //     numTertiary = index;
  //   }  
  //   else {
  //     tertiary[index] = swatch;
  //     tertiary.length = index + 1;
  //   }
  //   numTertiary = index + 1;
  //   this.setState({ tertiary, numTertiary });
  // }

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

  // createTertiaryPanel(index) {
  //   const tertiaryMix = this.getTertiaryMix(index);
  //   return (
  //     <SwatchPanel key={'Color' + index} list={tertiaryMix} label={'Colour ' + (index + 1)} onActiveChanged={(swatch) => this.changeTertiary(swatch, index)}/>
  //   );
  // }

  // getTertiaryMix(index) {
  //   const { primary, secondary, tertiary } = this.state;

  //   // use secondary mix
  //   const tertiaryMix = primary.mix.map((name) => _.find(COLORS, { name }).name);
    
  //   // remove previous colour choices
  //   // remove around
  //   const previousColor = secondary;
  //   // tertiaryMix = this.removeAround(previousColor, tertiaryMix);

  //   for (let i = 0; i < index + 1; i++) {
  //     previousColor = i === 0 ? secondary : tertiary[i - 1];
  //     tertiaryMix = removeAround(previousColor.name, tertiaryMix);
  //   }

  //   return _.map(tertiaryMix, name => _.find(COLORS, { name }));
  // }

  createSwatchPanel({ label, mix, onChanged, isGrouped, swatch }) {
    // const mix = primary.mix.map((name) => _.find(COLORS, { name }));
    return <SwatchPanel key={'Swatch ' + label} list={mix} label={label} onActiveChanged={(...args) => onChanged(...args)} grouped={isGrouped} swatch={swatch} />
  }

  render() {
    const panelLabels = ['Primary', 'Secondary', 'Colour {{index}}'];
    const { palette, cta } = this.state;

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
        {/*<PreviewPanel primary={primary} secondary={secondary} tertiaryList={tertiary} neutralList={neutrals}/>*/}
        {/* <ExportPanel /> */}

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
