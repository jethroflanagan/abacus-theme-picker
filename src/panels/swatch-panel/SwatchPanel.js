import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Swatch from './components/Swatch';
import MainSwatch from './components/MainSwatch';
import EmptySwatchHeader from './components/EmptySwatchHeader';
import TrashButton from './components/TrashButton';
import AddPanelButton from './components/AddPanelButton';

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
    console.log(props);
    if (!props.list || !Array.isArray(props.list) || !Array.isArray(this.props.list)) {
      return;
    }
    const nextList = props.list.map(swatch => swatch.name).join(',');
    const list = this.props.list.map(swatch => swatch.name).join(',');

    if (props.swatch) {
      this.setState({ active: props.swatch });
    }
    else if (nextList != list) {
      const active = this.state.active;
      if (active && !_.find(nextList, { name: active.name })) {
        this.setState({ active: null });
        return;
      }
      this.setState({ active });
    }
  }

  removePanel() {
    this.props.removePanel();
  }

  showNextPanel() {
    this.props.showNextPanel();
  }

  render() {
    const { list, grouped, label, canRemove, slim, showNextPanel } = this.props;
    const { isShowing, active } = this.state;
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
    let trashButton = null;
    let addPanelButton = null;

    if (canRemove) {
      trashButton = <TrashButton onClick={() => this.removePanel()} />;
    }

    if (showNextPanel) {
      addPanelButton = <AddPanelButton onClick={() => this.showNextPanel()} />;
    }

    // swap to "plus" header for panels where colour is chosen
    const header = (!active
      ? <EmptySwatchHeader />
      : <MainSwatch swatch={active} label={label} />
    );

    return (
      <div className={'SwatchPanel' + (slim ? ' SwatchPanel--slim': '') + (isShowing ? ' SwatchPanel--hidden' : '')}>
        <div className="SwatchPanel-content">
          {header}
          {content}
          <div className="SwatchPanel-controls">
            {trashButton}
            {addPanelButton}
          </div>
        </div>
      </div>
    );
  }
}
