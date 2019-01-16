import * as React from "react";
import './Button.scss';

export class Button extends React.Component {
  // Set default properties
  static defaultProps = {
    label: "Button",
    type: "primary",
  }

  render() {
    const { label, type, stretch } = this.props;
    let classNames = 'Button' + ' Button--' + type;
    if (stretch) {
      classNames += ' Button--stretch';
    }
    return (
      <div className={classNames} type={type} {...this.props} >
        {label}
      </div>
    );
  }
}
