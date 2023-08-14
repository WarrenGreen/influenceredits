import React, { Component } from "react";

class Word extends Component{ 
  
  constructor (props) {
    super(props);

    this.elementRef = React.createRef();
  }

handleTokenEvent = event => {
  this.props.selectedCallback(this.props.state.id)
}


handleStartTokenEvent = event => {
  this.props.selectedStartCallback(this.props.state.id)
}

handleEndTokenEvent = event => {
  this.props.selectedEndCallback(this.props.state.id)
}
  
componentDidMount() {
  this.elementRef.current.addEventListener('onSelected', this.handleTokenEvent);
  this.elementRef.current.addEventListener('onSelectedStart', this.handleStartTokenEvent);
  this.elementRef.current.addEventListener('onSelectedEnd', this.handleEndTokenEvent);
  this.elementRef.current.addEventListener('cemented', this.handleEndTokenEvent);
}

componentWillUnmount() {
  this.elementRef.current.removeEventListener('onSelected', this.handleTokenEvent);
  this.elementRef.current.removeEventListener('onSelectedStart', this.handleStartTokenEvent);
  this.elementRef.current.removeEventListener('onSelectedEnd', this.handleEndTokenEvent);
  this.elementRef.current.removeEventListener('cemented', this.handleCementEvent);
}

render() {
  let styleValues = {};

  if (this.props.state.rangeColor) {
    styleValues["backgroundColor"] = this.props.state.rangeColor;
  }

  if (this.props.state.selected) {
    styleValues["backgroundColor"] = "#ACCEF7";
  }

  if (this.props.state.selectedStart || (!this.props.state.selected && this.props.state.rangeStart)) {
    styleValues["borderRadius"] = "5px 0px 0px 5px";
  }

  if (this.props.state.selectedEnd|| (!this.props.state.selected && this.props.state.rangeEnd)) {
    styleValues["borderRadius"] = "0px 5px 5px 0px";
  }

  if ((this.props.state.selectedStart || (!this.props.state.selected && this.props.state.rangeStart)) && (this.props.state.selectedEnd || (!this.props.state.selected && this.props.state.rangeEnd))) {
    styleValues["borderRadius"] = "5px 5px 5px 5px";
  }


  return (
    <span ref={this.elementRef} onClick={() => {this.props.seekVideo(this.props.state.id)}} style={styleValues}><span className="inner-span">{this.props.state.text}</span></span>
  )
}
}

export default Word;