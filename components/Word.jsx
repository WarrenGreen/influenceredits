import React, { Component } from "react";

class Word extends Component{ 
  
  constructor (props) {
    super(props);

    this.elementRef = React.createRef();
  }

render() {
  let styleValues = {};
  let innerStyleValues = {};

  if (this.props.state.rangeColor) {
    styleValues["backgroundColor"] = this.props.state.rangeColor;
  }

  if (this.props.state.selected) {
    styleValues["backgroundColor"] = "#ACCEF7";
  }

  if ((!this.props.state.selected && this.props.state.rangeStart) || (!this.props.state.selected && this.props.state.rangeEnd)) {
    styleValues["cursor"] = "col-resize";
    innerStyleValues["cursor"] = "col-resize";
  }

  if ((this.props.state.selectedStart || (!this.props.state.selected && this.props.state.rangeStart)) && (this.props.state.selectedEnd || (!this.props.state.selected && this.props.state.rangeEnd))) {
    styleValues["borderRadius"] = "5px 5px 5px 5px";
  } else if (this.props.state.selectedStart || (!this.props.state.selected && this.props.state.rangeStart)) {
    styleValues["borderRadius"] = "5px 0px 0px 5px";
  } else if (this.props.state.selectedEnd|| (!this.props.state.selected && this.props.state.rangeEnd)) {
    styleValues["borderRadius"] = "0px 5px 5px 0px";
  }


  return (
    <span 
      onMouseOut={this.props.onMouseOut}
      onMouseOver={this.props.onMouseOver}
      onMouseDown={this.props.onMouseDown}
      ref={this.elementRef}
      onClick={() => {this.props.seekVideo(this.props.state.id)}}
      style={styleValues}>
        <span style={innerStyleValues} className="inner-span">
          {this.props.state.text}
        </span>
    </span>
  )
}
}

export default Word;