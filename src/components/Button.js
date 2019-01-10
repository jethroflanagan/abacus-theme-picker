import * as React from "react";
import './Button.scss';

export class Button extends React.Component {
  // Set default properties
  static defaultProps = {
    label: "Button",
    type: "primary",
  }

  render() {
    const { label, type } = this.props;
    const classNames = 'Button' + ' Button--' + type;
    return (
      <div className={classNames} type={type} {...this.props} >
        {label}
      </div>
    );
  }
}
