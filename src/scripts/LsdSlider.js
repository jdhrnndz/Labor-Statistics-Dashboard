/* jshint esversion: 6 */
/*
*  Name: Labor Statistics Dashboard Custom Slider
*  Author: John Denielle Hernandez
*  Desc: Custom slider component similar to input of type range with some
*    additional features such as multiple values and automatic orientation
*    detection.
*/

/*
*  TODO: Configurable handles example
*
*  TODO: Apply prop validation
*/

use("strict");

const React = require('react');

/*
*  LsdSlider React Component
*  States:
*    position: [JSON object] {
*      top: [float]
*      left: [float]
*    orientation: [string]
*    }
*  Props:
*    width: [float] Used in normalization of mouse coords - horizontal.
*    height: [float] Used in normalization of mouse coords - vertical.
*    min: [float]
*    max: [float]
*    multiple: [integer] Determines the number of handles in the slider.
*
*  TODO: Fix handle offset computation when slider width is not 5px. uhmm. nvm
*        Do this instead, receive alignment prop with values:
*        left/top, middle, right/bottom. default is left/top.
*/
module.exports = React.createClass({
  getInitialState: function() {
    return {
      position: {
        top: 0,
        left: 0
      },
      dimension: {
        width: 0,
        height: 0
      },
      orientation: "",
      values: []
    };
  },
  componentWillMount: function() {
    if(!(this.props.width || this.props.height)){
      console.error("Warning: LsdSlider's width and height properties are both null. Please declare at least one property.");
    }

    let correctWidth = parseInt(this.props.width) || 5,
    correctHeight = parseInt(this.props.height) || 5,

    /*
    *  Computation for distributing multiple handles evenly along the slider.
    */
    handleCount = this.props.multiple || 1,
    percentInterval = (handleCount > 1)?100/(handleCount-1):0,
    values = [];

    for(let i=0; i<handleCount; i++){
      values.push(percentInterval*i);
    }

    /*
    *  Automatic orientation identification lmao.
    *  This state is passed to LsdSliderHandle.
    */
    let orientation = (correctWidth>correctHeight)?"x":"y";

    this.setState({
      dimension: {
        width: correctWidth,
        height: correctHeight
      },
      orientation,
      handleCount,
      values
    });
  },
  componentDidMount: function() {
    /*
    *  Identify the position of this component after it has been rendered on
    *  the DOM. This state is passed to LsdSliderHandle.
    */
    let componentPosition = this.props.cumulativeOffset(this.componentInstance);

    this.setState({
      position: {
        top: componentPosition.top,
        left: componentPosition.left
      }
    });
  },
  /*
  *  Normalization of mouse coordinates relative to the slider.
  */
  normalizeMouse: function(mouseCoords, handleDimension) {
    if(this.state.orientation === "x")
      return ((mouseCoords.x-this.state.position.left-handleDimension.width/2)/this.state.dimension.width)*100;
    else
      return ((mouseCoords.y-this.state.position.top-handleDimension.height/2)/this.state.dimension.height)*100;
  },
  /*
  *  Forces a threshold to the drag value to prevent handle from going
  *  outside the slider.
  */
  computeHandleOffset: function(handleDimension) {
    if(this.state.orientation === "x")
      return ((handleDimension.width/2)/this.state.dimension.width)*100;
    else
      return ((handleDimension.height/2)/this.state.dimension.height)*100;
  },
  applyThreshold: function(value) {
    /*
    *  Percentage only in here that's why min == 0 and max == 100.
    *  Actual value with respect to the min/max parameters would be computed
    *  somewhere else.
    */
    return (value<0)?0:((value>100)?100:value);
  },
  computeHandlePosition: function(handleId, mouseCoords, handleDimension) {
    /*
    *  NOTE: When adding support for min/max parameters, compute it here.
    */
    let realValue = this.normalizeMouse(mouseCoords, handleDimension);
    realValue = this.applyThreshold(realValue);
    let offsetValue = realValue-this.computeHandleOffset(handleDimension);
    this.updateHandleValue(handleId, realValue);

    let values = this.state.values;

    /*
    *  Looks through the array of values and determines if a certain (or some)
    *  of the other handles aside from the one being dragged need to be dragged
    *  too when the allowPass property is not specified or is false.
    *
    *  TODO: Optimize. Must be able to handle 2000 handles or more.
    */
    let hndlCt = this.state.handleCount;
    if(this.props.allowPass != "true"){
      for(let i=hndlCt; i--;){
        if(i<handleId && this.state.values[i]>this.state.values[handleId] || i>handleId && this.state.values[i]<this.state.values[handleId]){
          values[i] = realValue;
        }
      }
    }

    this.setState({
      values: values
    });

    return {realValue, offsetValue};
  },
  updateHandleValue: function(handleId, value) {
    let values = this.state.values;

    values[handleId] = value;

    this.setState({
      values: values
    });
  },
  render: function() {
    /*
    *  Sets orientation based on dimension.
    *  By default, a slider's rail is 5px thick.
    *
    *  TODO:
    */
    let style = (this.state.orientation === "x")?
      ({width: this.props.width + "px", height: this.state.dimension.height + "px"}):
      ({height: this.props.height + "px", width: this.state.dimension.width + "px"});

    let handles = [];
    let ranges = [];

    for(let i=0; i<this.state.handleCount; i++){
      handles.push(
        <LsdSliderHandle
          key={i}
          id={i}
          computeHandlePosition={this.computeHandlePosition}
          computeHandleOffset={this.computeHandleOffset}
          orientation={this.state.orientation}
          enforcedValue={this.state.values[i]}/>
      );

      /*
      *  Could have placed a check if it is the last value to prevent undefined
      *  diff (value for slider range), but the output is fine as it is.
      */
      let diff = this.state.values[i+1] - this.state.values[i];

      ranges.push(
        <LsdSliderRange
          key={i}
          orientation={this.state.orientation}
          length={diff}
          position={this.state.values[i]}
          dimension={this.state.dimension}/>
      )
    }

    return (
      <div
        className="lsd-slider"
        style={style}
        ref={(ref) => this.componentInstance = ref}> {/*Refs! Must be a pro.*/}
        {ranges}
        {handles}
      </div>
    );
  }
});
