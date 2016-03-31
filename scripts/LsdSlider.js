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
*    computeHandlePosition= [function] Used to get new position when dragging.
*    computeHandleOffset= [function] Uses the offset height/width of handle.
*    orientation: [string] "x" | "y" Determined by LsdSlider React Component.
*    initialValue: [float] Used to show multiple handles evenly distributed 
*                  across the slider initially.
*  Attributes: (Values inserted into "this")
*    dimension:  [JSON object] Offset dimension of the handle. {
*	   width: [float] Obtained from offsetWidth HTML element property.
*      height: [float] Obtained from offsetHeight HTML element property.
*    }
*    borderWidth: [float] Used for offset 
*    handleOffset: [float] 
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
  *  TODO: Check if clientHeight/Width or scrollHeight/Width can replace the
  *        handle offset computation using the borderWidth state.
  *
  *  TODO: Refactor all code that relies on orientation. Eliminate redundancy.
  * 
  *  TODO: Try Using ReactLink
  */
  getInitialState: function() {
    return {
      dragging: false,
      position: {
        top: 0,
        left: 0
      }
    };
  },  
  componentWillMount: function() {
  	/*
  	*  Sort of inserting the dimension object/key onto 'this'
  	*/
  	this.dimension = {
      width: 0,
      height: 0
    };
  },
  componentDidMount: function() {
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

    /*
    *  this.componentInstance cannot be accessed before the component mounted.
    */
    this.dimension = {
      width: this.componentInstance.offsetWidth,
      height: this.componentInstance.offsetHeight
    };
    this.borderWidth = parseInt(getComputedStyle(this.componentInstance).getPropertyValue("border-width"));
  	this.handleOffset = this.props.computeHandleOffset(this.dimension);
  },
  componentWillUnmount: function(){
  	document.removeEventListener("mousemove", this.dragEvent);
    document.removeEventListener("mouseup", this.dragStop);
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

      var handlePos = this.props.computeHandlePosition(
      	this.props.id,
        {
          x: event.pageX,
          y: event.pageY
        },
        this.dimension
      );
    }
  },
  render: function() {
  	/*
  	*  The px unit has to do something with the visual offset of the handle.
  	*
  	*  TODO: Brace self for configurable handles hell. >:)
  	*/
    var style = (this.props.orientation == "x")?
      ({
        left: this.props.enforcedValue-this.handleOffset + "%",
        top: -(this.dimension.height-this.borderWidth)/2 + "px"
      }):
      ({
        top: this.props.enforcedValue-this.handleOffset + "%",
        left: -(this.dimension.width-this.borderWidth)/2 + "px"
      });

    return (
      <div
        className="lsd-slider-handle"
        onMouseDown={this.dragStart}
        style={style}
        ref={(ref) => this.componentInstance = ref}>
        <div className="sun">
            <div className="ray" id="ray1"></div>
            <div className="ray" id="ray2"></div>
            <div className="ray" id="ray3"></div>
            <div id="suncore"/>
        </div>
      </div>
    );
  }
});

/*
*  LsdSliderRange React Component
*  States:
*
*  Props:
*  
*  NOTE: LsdSliderRange must only be shown when there are more than 1 handle.
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
var LsdSlider = React.createClass({
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

  	var correctWidth = parseInt(this.props.width) || 5;
  	var correctHeight = parseInt(this.props.height) || 5;

    /*
    *  Computation for distributing multiple handles evenly along the slider.
    */
  	var handleCount = this.props.multiple || 1;
  	var percentInterval = (handleCount > 1)?100/(handleCount-1):0;
  	var values = [];

  	for(var i=0; i<handleCount; i++){
  		values.push(percentInterval*i);
  	}

    /*
    *  Automatic orientation identification lmao.
    *  This state is passed to LsdSliderHandle.
    */
    var orientation = (correctWidth>correctHeight)?"x":"y";

    this.setState({
      dimension: {
      	width: correctWidth,
      	height: correctHeight
      },
      orientation: orientation,
      handleCount: handleCount,
      values: values
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
      return ((mouseCoords.x-this.state.position.left-handleDimension.width/2)/this.state.dimension.width)*100;
    else
      return ((mouseCoords.y-this.state.position.top-handleDimension.height/2)/this.state.dimension.height)*100;
  },
  /*
  *  Forces a threshold to the drag value to prevent handle from going
  *  outside the slider.
  */
  computeHandleOffset: function(handleDimension) {
    if(this.state.orientation == "x")
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
    var realValue = this.normalizeMouse(mouseCoords, handleDimension);
    realValue = this.applyThreshold(realValue);
    var offsetValue = realValue-this.computeHandleOffset(handleDimension);
    this.updateHandleValue(handleId, realValue);

    var values = this.state.values;

    /*
    *  Looks through the array of values and determines if a certain (or some)
    *  of the other handles aside from the one being dragged need to be dragged
    *  too when the allowPass property is not specified or is false.
    *
    *  TODO: Optimize. Must be able to handle 2000 handles or more.
    */
    var hndlCt = this.state.handleCount;
    if(this.props.allowPass != "true"){
      for(var i=hndlCt; i--;){
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
    var values = this.state.values;

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
    var style = (this.state.orientation == "x")?
      ({width: this.props.width + "px", height: this.state.dimension.height + "px"}):
      ({height: this.props.height + "px", width: this.state.dimension.width + "px"});

    var handles = [];
    
    for(var i=0; i<this.state.handleCount; i++){
      handles.push(
        <LsdSliderHandle
          key={i}
          id={i}
          computeHandlePosition={this.computeHandlePosition}
          computeHandleOffset={this.computeHandleOffset}
          orientation={this.state.orientation}
          enforcedValue={this.state.values[i]}/>
      );
    }

    return (
      <div
        className="lsd-slider"
        style={style}
        ref={(ref) => this.componentInstance = ref}> {/*Refs! Must be a pro.*/}
        <LsdSliderRange />
        {handles}
      </div>
    );
  }
});

ReactDOM.render(
  <LsdSlider key="1" width="300" multiple="2" min="1" max="8"/>,
  document.getElementById('lsd-slider-1')
);

ReactDOM.render(
  <LsdSlider key="2" height="240"/>,
  document.getElementById('lsd-slider-2')
);