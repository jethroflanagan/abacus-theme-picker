import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from '../../../components/Button';

import './ExportControls.scss';

export class ExportControls extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      separateColors: false,
    }
  } 

  toggleSeparateColors() {
    const separateColors = !this.state.separateColors;
    this.setState({ separateColors });
    this.props.setSeparateColors(separateColors);
  }

  render() {
    const {separateColors} = this.state;
    return (
      <div className="ExportControls">
        <Button label="Export as PDF" type="tertiary" />
        <Button label="Export for developers" type="tertiary" />
        <Button label="Use in Sketch" type="tertiary" />
        <Button label="Use in Form Designer" type="tertiary" />
        <Button label="Copy to clipboard" type="tertiary" />

        <div className="ExportControls-extra">
          <Button label={separateColors ? 'Juxtapose palette' : 'Separate palette'} type="tertiary" onClick={() => this.toggleSeparateColors()}/>
          <Button label="Make recommendation" type="primary" hint='Will reconfigure colours for a better architecture experience' />
        </div>
      </div>
    );
  }
}
