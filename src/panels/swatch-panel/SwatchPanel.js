import React, { Component } from 'react';
import _ from 'lodash';
import Swatch from './components/Swatch';
import MainSwatch from './components/MainSwatch'
import './SwatchPanel.scss';

export class SwatchPanel extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      active: props.swatch,
    }
  } 

  makeActive(swatch) {
    const active = ( 
      swatch === this.state.active 
      ? null // deselect
      : swatch // select
    )
    this.setState({ active });
    if (this.props.onActiveChanged) {
      this.props.onActiveChanged(swatch);
    }
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
    if (!props.list || !Array.isArray(props.list) || !Array.isArray(this.props.list)) return;
    const nextList = props.list.map(swatch => swatch.name).join(',');
    const list = this.props.list.map(swatch => swatch.name).join(',');

    if (nextList != list) {
      this.setState({ active: null });
    }
  }

  render() {
    const { list, grouped, label } = this.props;
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

    return (
      <div className="SwatchPanel">
        <div className="SwatchPanel-content">
          <MainSwatch swatch={this.state.active} label={label} />
          {content}
        </div>
      </div>
    );
  }
}