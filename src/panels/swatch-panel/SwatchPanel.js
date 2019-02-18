import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Swatch from './components/Swatch';
import MainSwatch from './components/MainSwatch';
import { Button } from 'src/components/button/Button';

import './SwatchPanel.scss';

export class SwatchPanel extends Component  {

  static props = {
    grouped: PropTypes.Bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      active: props.swatch,
      isShowing: true,
    }
  }

  makeActive(swatch) {
    // const active = (
    //   swatch === this.state.active
    //   ? null // deselect
    //   : swatch // select
    // )
    const active = swatch;
    this.setState({ active });
    if (this.props.onActiveChanged) {
      this.props.onActiveChanged(swatch);
    }
  }

  componentDidMount() {
    requestAnimationFrame(() => this.setState({ isShowing: false }));
  }

  createGroup = (group) => {
    const { active } = this.state;

    return (
      <div>
        <div className="SwatchGroup-label">{group.name}</div>
        {this.createList(group.swatches)}
      </div>
    );
  }

  createList = (list) => {
    const { active } = this.state;

    return (
      <div className="SwatchGroup">
        {_.map(list, (swatch, i) =>
          <Swatch key={swatch.name + '_' + i} swatch={swatch} active={!active || active === swatch} onClick={() => this.makeActive(swatch)} />
        )}
      </div>
    );
  }

  componentWillReceiveProps(props) {
    if (!props.list || !Array.isArray(props.list) || !Array.isArray(this.props.list)) {
      return;
    }
    console.log('props return', props);
    const nextList = props.list.map(swatch => swatch.name).join(',');
    const list = this.props.list.map(swatch => swatch.name).join(',');

    if (props.swatch) {
      this.setState({ active: props.swatch });
    }
    else if (nextList != list) {
      this.setState({ active: null });
    }
  }

  removePanel() {
    this.props.removePanel();
  }

  render() {
    const { list, grouped, label, canRemove, slim } = this.props;
    const { isShowing } = this.state;
    let content = null;
    if (grouped) {
      content = (
        <div className="SwatchPanel-swatches">
          {this.createGroup(list.dawn)}
          {this.createGroup(list.dusk)}
        </div>
      );
    }
    else {
      content = (
        <div  className="SwatchPanel-swatches SwatchPanel-swatches--no-group">
          {this.createList(list)}
        </div>
      );
    }
    let removeButton = null;
    if (canRemove) {
      removeButton = <div className="SwatchPanel-remove" ><Button label='Remove' type="tertiary" stretch="true" onClick={() => this.removePanel()} /></div>;
    }

    return (
      <div className={'SwatchPanel' + (slim ? ' SwatchPanel--slim': '') + (isShowing ? ' SwatchPanel--hidden' : '')}>
        <div className="SwatchPanel-content">
          <MainSwatch swatch={this.state.active} label={label} />
          {content}
          {removeButton}
        </div>
      </div>
    );
  }
}
