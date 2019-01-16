import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from '../../../components/Button';

import './ExportControls.scss';

export class ExportControls extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      separateColors: false,
      isVisible: false,
    }
  }

  toggleSeparateColors() {
    const separateColors = !this.state.separateColors;
    this.setState({ separateColors });
    this.props.setSeparateColors(separateColors);
  }

  toggleVisible() {
    const isVisible = !this.state.isVisible;
    this.setState({ isVisible });
    this.props.changeVisibility(isVisible);
  }

  render() {
    const { separateColors, isVisible } = this.state;
    const mainClassNames = 'ExportControls' + (isVisible ? ' ExportControls--visible' : '');
    const menuClassNames = 'ExportControls-menu' + (isVisible ? ' ExportControls-menu--visible' : '');
    return (
      <div className={mainClassNames}>
        <div className="ExportControls-icon" onClick={() => this.toggleVisible()}>
          <div className="ExportControls-iconBar" />
          <div className="ExportControls-iconBar" />
          <div className="ExportControls-iconBar" />
        </div>
        <div className={menuClassNames}>
          <div  className="ExportControls-menuContent">
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
        </div>
      </div>
    );
  }
}
