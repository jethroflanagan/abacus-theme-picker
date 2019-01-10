import React, { Component } from 'react';
import _ from 'lodash';
import './ControlPanel.scss';

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
  render() {
    const { experience } = this.state;
    const experiences = ['Transactional', 'Retail', 'Tool', 'Mobile', 'Emailer', 'Billboard & media'];
    return (
      <div className="ControlPanel">
        <div className="ControlPanel-title">Experience</div>
        <div>
          { _.map(experiences, name => (
            <div key={name} className={'ControlPanel-experience' + (experience === name ? ' ControlPanel-experience--active' : '')} onClick={() => this.chooseExperience(name)}>{name}</div>) 
          )}
            
        </div>
      </div>
    );
  }
}