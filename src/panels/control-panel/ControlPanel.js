import React, { Component } from 'react';
import _ from 'lodash';
import './ControlPanel.scss';

const WEB = [
  {
    name: 'Transactional', id: 'TransactionalWeb',
  },
  {
    name: 'Retail', id: 'RetailWeb',
  },
  {
    name: 'Tool', id: 'ToolWeb',
  },
];
const MOBILE = [
  {
    name: 'Transactional', id: 'TransactionalMobile',
  },
  {
    name: 'Retail', id: 'RetailMobile',
  },
  {
    name: 'Tool', id: 'ToolMobile',
  },
];

const COMMS = [
  {
    name: 'Emailer', id: 'Emailer',
  },
  {
    name: 'Billboard & media', id: 'Billboard',
  },
];

export class ControlPanel extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      experience: null
    }
  } 

  chooseExperience(experience) {
    this.setState({ experience });
    this.props.onChange(experience);
  }

  createMenuItem({ name, id }) {
    const { experience } = this.state;
    return <div key={name} className={'ControlPanel-experience' + (experience === id ? ' ControlPanel-experience--active' : '')} onClick={() => this.chooseExperience(id)}>{name}</div>;
  }

  render() {
    return (
      <div className="ControlPanel">
        <div className="ControlPanel-title">Web</div>
        <div>
          { _.map(WEB, item => this.createMenuItem(item)) }
        </div>
        <div className="ControlPanel-title">Mobile</div>
        <div>
          { _.map(MOBILE, item => this.createMenuItem(item)) }
        </div>
        <div className="ControlPanel-title">Communication</div>
        <div>
          { _.map(COMMS, item => this.createMenuItem(item)) }
        </div>
      </div>
    );
  }
}
