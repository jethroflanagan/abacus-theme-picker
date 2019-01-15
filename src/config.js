import _ from 'lodash';
import tinycolor  from 'tinycolor2';


function setupColor(item) {
  return {
    ...item,
    rgb: item.color.toRgb(),
    hsv: item.color.toHsv(),
    hex: item.color.toHex(),
    greyscale: item.color.greyscale().toRgb(),
    nameColor: item.color.isDark() ? '#fff': '#000',
    isDark: item.color.isDark(),
  }
}

export const GROUPS = {
  neutrals: { name: 'Neutrals' },
  dusk: { name: 'Dusk' },
  dawn: { name: 'Dawn' },
}

export const NEUTRALS = [
  { name: "White", color: tinycolor({ r: 255, g: 255, b: 255 }), group: 'neutrals' },
  { name: "Background-Light", color: tinycolor({ r: 249, g: 248, b: 248 }), group: 'neutrals' },
  { name: "Background-Mid", color: tinycolor({ r: 244, g: 243, b: 243 }), group: 'neutrals' },
  { name: "Background-Dark", color: tinycolor({ r: 238, g: 237, b: 237 }), group: 'neutrals' },
  { name: "Line-Light", color: tinycolor({ r: 227, g: 226, b: 226 }), group: 'neutrals' },
  { name: "Line-Dark", color: tinycolor({ r: 202, g: 199, b: 199 }), group: 'neutrals' },
  { name: "Text-Light", color: tinycolor({ r: 154, g: 149, b: 149 }), group: 'neutrals' },
  { name: "Text-Mid", color: tinycolor({ r: 120, g: 114, b: 114 }), group: 'neutrals' },
  { name: "Text-Dark", color: tinycolor({ r: 82, g: 74, b: 74 }), group: 'neutrals' },
  { name: "Text-Darkest", color: tinycolor({ r: 45, g: 35, b: 35 }), group: 'neutrals' },
].map(setupColor);

export let NEUTRALS_WEIGHTS = {
  RetailWeb: [
    {
      swatch: 'White',
      weight: 138,
    },
    {
      swatch: 'Background-Light',
      weight: 44,
    },
    {
      swatch: 'Line-Light',
      weight: 6,
    },
    {
      swatch: 'Text-Mid',
      weight: 4,
    },
    {
      swatch: 'Text-Dark',
      weight: 4,
    },
    {
      swatch: 'Text-Darkest',
      weight: 4,
    },
  ],
  TransactionalWeb: [
    {
      swatch: 'White',
      weight: 76,
    },
    {
      swatch: 'Background-Mid',
      weight: 100,
    },
    {
      swatch: 'Line-Light',
      weight: 6,
    },
    {
      swatch: 'Line-Dark',
      weight: 6,
    },
    {
      swatch: 'Text-Light',
      weight: 3,
    },
    {
      swatch: 'Text-Mid',
      weight: 3,
    },
    {
      swatch: 'Text-Dark',
      weight: 3,
    },
    {
      swatch: 'Text-Darkest',
      weight: 3,
    },
  ],
  ToolWeb: [
    {
      swatch: 'White',
      weight: 76,
    },
    {
      swatch: 'Background-Dark',
      weight: 100,
    },
    {
      swatch: 'Line-Light',
      weight: 6,
    },
    {
      swatch: 'Line-Dark',
      weight: 6,
    },
    {
      swatch: 'Text-Light',
      weight: 3,
    },
    {
      swatch: 'Text-Mid',
      weight: 3,
    },
    {
      swatch: 'Text-Dark',
      weight: 3,
    },
    {
      swatch: 'Text-Darkest',
      weight: 3,
    },
  ],

  RetailMobile: [
    {
      swatch: 'White', 
      weight: 182,
    },
    {
      swatch: 'Line-Light',
      weight: 6,
    },
    {
      swatch: 'Text-Mid',
      weight: 4,
    },
    {
      swatch: 'Text-Dark',
      weight: 4,
    },
    {
      swatch: 'Text-Darkest',
      weight: 4,
    },
  ],
  TransactionalMobile: [
    {
      swatch: 'White', 
      weight: 182,
    },
    {
      swatch: 'Line-Light',
      weight: 6,
    },
    {
      swatch: 'Text-Light',
      weight: 6,
    },
    {
      swatch: 'Text-Darkest',
      weight: 6,
    },
  ],
  ToolMobile: [
    {
      swatch: 'White',
      weight: 170,
    },
    {
      swatch: 'Background-Light',
      weight: 12,
    },
    {
      swatch: 'Line-Light',
      weight: 6,
    },
    {
      swatch: 'Text-Light',
      weight: 6,
    },
    {
      swatch: 'Text-Darkest',
      weight: 6,
    },
  ],
};

// be deadly and overwrite on the fly with actual swatches, not just names
_.map(NEUTRALS_WEIGHTS, (section, sectionName) => {
  NEUTRALS_WEIGHTS[sectionName] = _.map(section, item => ({
    ...item,
    swatch: _.find(NEUTRALS, { name: item.swatch }),
  }))
});
console.log(NEUTRALS_WEIGHTS);

export const PALETTE_WEIGHTS = {
  1: [1],
  2: [6, 4],
  3: [5, 3, 2],
  4: [4, 3, 2, 1],
  5: [30, 25, 20, 15, 10],
};

export let COLORS = [
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
].map(setupColor);


COLORS.forEach((color) => {
  const group = GROUPS[color.group];
  if (!group.swatches) {
    group.swatches = [];
  }
  group.swatches.push(color);
  // return { ...color, mix: removeAround(color.name) };
});

export const DAWN_DUSK_GROUPED = {
  dawn: GROUPS.dawn,
  dusk: GROUPS.dusk,
};
export const DAWN_DUSK = [...DAWN_DUSK_GROUPED.dawn.swatches, ...DAWN_DUSK_GROUPED.dusk.swatches];
