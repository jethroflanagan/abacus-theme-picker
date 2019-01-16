import React, { Component } from 'react';
import _ from 'lodash';
import { toRgbCss } from '../../../utils/helpers';

import './Labeller.scss';
import { PALETTE_WEIGHTS, PREVIEW_WEIGHTS } from '../../../config';

export class Labeller extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      // separateColors: false,
    }
  }

  createLabel({ label, position, id }) {
    // const offset = 100;
    // const top = `calc(${(label.weight / totalWeight) * 100}%)`;
    return (
      <div key={id} className="Labeller-legend">
        <div className="Labeller-legendLine">
          <div className="Labeller-swatch" style={{ backgroundColor: toRgbCss(label.swatch.rgb)}}></div>
          <div className="Labeller-labelName">
            {label.name}
          </div>
        </div>
        <div className="Labeller-labelSwatchName">
          {label.swatch.name}
        </div>
      </div>
    );
  }
  // createLabel({ label, position, id }) {
  //   // const offset = 100;
  //   // const top = `calc(${(label.weight / totalWeight) * 100}%)`;
  //   return (
  //     <div key={id} className="Labeller-legend" style={{top: position}}>
  //       <div className="Labeller-legendLine">
  //         <div className="Labeller-swatch" style={{ backgroundColor: toRgbCss(label.swatch.rgb)}}></div>
  //         <div className="Labeller-labelName">
  //           {label.name}
  //         </div>
  //       </div>
  //       <div className="Labeller-labelSwatchName">
  //         {label.swatch.name}
  //       </div>
  //     </div>
  //   );
  // }

  createSection(labels) {
    labels = labels.filter(label => label.swatch);
    const section = [];
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      // if (label.weight < 10 && i < labels.length) {
      //   offset += 0;
      // }
      section.push(this.createLabel({ label, id: 'neutral ' + i }));
    }

    return section;
  }
  // createSection(labels) {
  //   labels = labels.filter(label => label.swatch);
  //   const totalWeight = _.reduce(labels, (total, label) => total + label.weight, 0);
  //   let currentWeight = 0;
  //   const section = [];
  //   let offset = 0;
  //   const offsets = Array(labels.length);
  //   let lastLabel = labels.slice(-1)[0];
  //   for (let i = labels.length - 2; i >= 0; i--) {
  //     const label = labels[i];
  //     if (Math.abs(label.weight - lastLabel.weight) < 10) {
  //       offset += 40;
  //     }
  //     else {
  //       offset = 0;
  //     }
  //     offsets[i] = offset;
  //     lastLabel = label;
  //   }
  //   offsets[labels.length - 1] = 20;

  //   for (let i = 0; i < labels.length; i++) {
  //     const label = labels[i];
  //     // if (label.weight < 10 && i < labels.length) {
  //     //   offset += 0;
  //     // }
  //     section.push(this.createLabel({ label, position: `calc(${currentWeight / totalWeight * 100 + '%'} - ${offsets[i]}px)`, id: 'neutral ' + i }));
  //     currentWeight += label.weight;
  //   }

  //   return section;
  // }

  render() {
    const { palette, neutrals, cta } = this.props;
    console.log('cta', cta);
    return (
      <div className="Labeller">
        <div className="Labeller-section" style={{flexGrow: PREVIEW_WEIGHTS.palette}}>
          {this.createSection(palette)}
        </div>
        <div className="Labeller-section" style={{flexGrow: PREVIEW_WEIGHTS.neutrals}}>
          {this.createSection(neutrals)}
        </div>
        <div className="Labeller-section" style={{flexGrow: PREVIEW_WEIGHTS.cta}}>
          {/* {this.createSection(palette)} */}
          {this.createLabel({ label: cta, position: 0, id: 'cta' })}
        </div>
      </div>
    );
  }
}
