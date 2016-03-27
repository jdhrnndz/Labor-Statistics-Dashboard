/*
*  Name: Labor Statistics Dashboard Custom Slider
*  Author: John Denielle Hernandez
*  Desc: Custom slider component similar to input of type range with some
*    additional such as multiple values and automatic orientation detection.
*/

/*
*  LsdSliderHandle React Component
*  States:
*    dragging:  [boolean] Needed to be checked if the handle needs to be moved
*               because the mouse listener is declared globally.
*    position:  [JSON object] {
*      top: [float] Changed when a vertical slider handle is being dragged.
*      left: [float] Changed when a horizontal slider handle is being dragged.
*    }
*  Props:
*    containerWidth: [float] Used in normalization of mouse coords - horizontal
*    containerHeight: [float] Used in normalization of mouse coords - vertical
*    containerPosition: [JSON object] Used in normalization of mouse coords {
*      top: [float]
*      left: [float]
*    }
*    orientation: [string] "x" | "y" Classified by LsdSlider React Component
*/
var LsdSliderHandle = React.createClass({
  /*
  *  TODO: Fix warning -> "getInitialState was defined on LsdSlider, a plain
  *  JavaScript class. This is only supported for classes created using
  *  React.createClass. Did you mean to define a state property instead?".
  *  
  *  TODO: Fix bug, resizing window breaks offset of handle in vertical slider.
  *  The horizontal slider seems to be clear of this bug.
  * 
  *  TODO: Consume initial value property from LsdSlider component
  */
  getInitialState: function() {
    return {
      dragging: false,
      position: {
        top: 0,
        left: 0
      },
      dimension: {
        width: 0,
        height: 0
      },
      borderWidth: 0
    };
  },
  componentWillMount: function() {
    /*
    *  Binding dragStart to mousedown should also be here but:
    *  onMouseDown > refs (by simplicity).
    *  Take note that I add the event listener to the document element because:
    *  1. The mousemove relies on the mouse's coordinates relative to the
    *     document, not the handle. Otherwise, the handle will move only if the
    *     mouse is moved inside the handle.
    *  2. If the mouse is released outside the handle, the drag will stop since
    *     the document, and not the handle, listens to that event.
    */
    document.addEventListener("mousemove", this.dragEvent);
    document.addEventListener("mouseup", this.dragStop);
  },
  componentDidMount: function() {
    var newDimension = {
      width: this.componentInstance.offsetWidth,
      height: this.componentInstance.offsetHeight
    };

    var handleOffset = this.props.computeHandleOffset(newDimension);

    var newPosition = (this.props.orientation == "x")?{top:handleOffset*-1, left:this.props.initialValue-handleOffset}:{top:this.props.initialValue-handleOffset ,left:handleOffset*-1}
    this.setState({
      dimension: newDimension,
      position: newPosition,
      borderWidth: parseInt(getComputedStyle(this.componentInstance).getPropertyValue("border-width"))
    });
  },
  dragStart: function() {
    this.setState ({
      dragging: true
    });
  },
  dragStop: function() {
    this.setState ({
      dragging: false
    });
  },
  dragEvent: function(event) {
    if (this.state.dragging) {
      /*
      *  Prevents the cursor to select elements while dragging the handle
      */
      if(event.stopPropagation) event.stopPropagation();
      if(event.preventDefault) event.preventDefault();

      var newValue = this.props.computeHandlePosition(
        {
          x: event.pageX,
          y: event.pageY
        }, this.state.dimension);

      if(this.props.orientation == "x") {
        this.setState({
          position: {
            left: newValue
          }
        });
      }
      else {
        this.setState({
          position: {
            top: newValue
          }
        });
      }
    }
  },
  render: function() {
    /*
    *  This is PROBABLY better than bothering to check the orientation and 
    *  setting the style to left xor top only.
    */
    var style = (this.props.orientation == "x")?
      ({left: this.state.position.left + "%", top: -(this.state.dimension.height-this.state.borderWidth)/2 + "px"}):
      ({top: this.state.position.top + "%", left: -(this.state.dimension.width-this.state.borderWidth)/2 + "px"});

    return (
      <span
        className="lsd-slider-handle lsd-sun-handle"
        onMouseDown={this.dragStart}
        style={style}
        ref={(ref) => this.componentInstance = ref}/>
    );
  }
});

/*
*  LsdSliderRange React Component
*  States:
*
*  Props:
*
*/

var LsdSliderRange = React.createClass({
  render: function() {
    return (
      <div
        className="lsd-slider-range"/>
    );
  }
});

/*
*  LsdSlider React Component
*  States:
*    position: [JSON object] {
*      top: [float]
*      left: [float]
*    orientation: [string] 
*    }
*  Props:
*    width: [float] Used in normalization of mouse coords - horizontal
*    weight: [float] Used in normalization of mouse coords - vertical
*    min: [float]
*    max: [float]
*    multiple: [integer]
*
*  TODO: Add computation for initial value of each handle
*
*/
var LsdSlider = React.createClass({
  getInitialState: function() {
    return {
      position: {
        top: 0,
        left: 0
      },
      orientation: ""
    };
  },
  componentWillMount: function() {
    /*
    *  Automatic orientation identification lmao.
    *  This state is passed to LsdSliderHandle.
    */
  	var orientation = (this.props.width>this.props.height)?"x":"y";

  	this.setState({
      orientation: orientation
    });
  },
  componentDidMount: function() {
    /*
    *  Identify the position of this component after it has been rendered on
    *  the DOM. This state is passed to LsdSliderHandle.
    */
    var componentPosition = cumulativeOffset(this.componentInstance);

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
    if(this.state.orientation == "x")
      return ((mouseCoords.x-this.state.position.left-handleDimension.width/2)/this.props.width)*100;
    else
      return ((mouseCoords.y-this.state.position.top-handleDimension.height/2)/this.props.height)*100;
  },
  /*
  *  Forces a threshold to the drag value to prevent handle from going
  *  outside the slider.
  */
  computeHandleOffset: function(handleDimension) {
    if(this.state.orientation == "x")
      return (handleDimension.width/2)/this.props.width*100;
    else
      return (handleDimension.height/2)/this.props.height*100;
  },
  applyThreshold: function(value, thresholdOffset) {
    var min = 0-thresholdOffset,
    max = 100-thresholdOffset;

    return (value<min)?min:((value>max)?max:value);
  },
  computeHandlePosition: function(mouseCoords, handleDimension) {
    var newValue = this.normalizeMouse(
      {
        x: event.pageX,
        y: event.pageY
      },
      handleDimension
    );
    
    var thresholdOffset = this.computeHandleOffset(handleDimension);
    newValue = this.applyThreshold(newValue, thresholdOffset);

    return newValue;
  },
  render: function() {
    /*
    *  Sets orientation based on dimension. By default, a slider is 5px thick.
    */
    var style = (this.state.orientation == "x")?
      ({width: this.props.width + "px", height: "5px"}):
      ({height: this.props.height + "px", width: "5px"});

    var handleCount = this.props.multiple || 1;
    var handles = [];
    var percentInterval = 100/(handleCount-1);
    
    for(var i=0; i<handleCount; i++){
      handles.push(
        <LsdSliderHandle
          key={i}
          computeHandlePosition={this.computeHandlePosition}
          computeHandleOffset={this.computeHandleOffset}
          orientation={this.state.orientation}
          initialValue={percentInterval*i}/>
      );
    }

    return (
      <div
        className="lsd-slider"
        style={style}
        ref={(ref) => this.componentInstance = ref}> {/*Refs! I must be a pro.*/}
        <LsdSliderRange />
        {handles}
      </div>
    );
  }
});

ReactDOM.render(
  <LsdSlider key="1" height="200" width="300" multiple="5" min="1" max="8"/>,
  document.getElementById('lsd-slider-1')
);

ReactDOM.render(
  <LsdSlider key="2" height="200" width="0"/>,
  document.getElementById('lsd-slider-2')
);