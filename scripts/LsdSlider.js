/*
*  Name: Labor Statistics Dashboard Custom Slider
*  Author: John Denielle Hernandez
*  Desc: Custom slider component similar to input of type range with some
*    additional such as multiple values and automatic orientation detection.
*/

var LsdSliderThumb = React.createClass({
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
    document.addEventListener("mousemove", this.dragEvent);
    document.addEventListener("mouseup", this.dragStop);
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
  dragEvent: function(e) {
    if (this.state.dragging) {
      /*
        The next two lines prevent the cursor to select text and items while dragging the slider handle
      */
      if(e.stopPropagation) e.stopPropagation();
      if(e.preventDefault) e.preventDefault();

      if(this.props.orientation == "x") {
      	var newLeftValue = ((mouseXY.x-this.props.containerPosition.left)/this.props.containerWidth)*100;
        newLeftValue = (newLeftValue<0)?0:((newLeftValue>100)?100:newLeftValue);

        this.setState({
          position: {
            left: newLeftValue
          }
        });
      }
      else {
        var newTopValue = ((mouseXY.y-this.props.containerPosition.top)/this.props.containerHeight)*100;
        newTopValue = (newTopValue<0)?0:((newTopValue>100)?100:newTopValue);

        this.setState({
          position: {
            top: newTopValue
          }
        });
      }
    }
  },
  render: function() {
    var styleValue = (this.props.orientation == "x")?
      ({left: this.state.position.left + "%"}):
      ({top: this.state.position.top + "%"});

    return (
      <span
        className="lsd-slider-thumb lsd-sun-thumb"
        onMouseDown={this.dragStart}
        style={styleValue}/>
    );
  }
});

var LsdSliderRange = React.createClass({
  render: function() {
    return (
      <div
        className="lsd-slider-range"/>
    );
  }
});

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
  	var orientationValue = (this.props.width > this.props.height)?"x":"y";
  	this.setState({
      orientation: orientationValue
    });
  },
  componentDidMount: function() {
    var componentPosition = cumulativeOffset(this.componentInstance);
    this.setState({
      position: {
      	top: componentPosition.top,
        left: componentPosition.left
      }
    });
  },
  render: function() {
    var styleValue = (this.state.orientation == "x")?
      ({width: this.props.width + "px", height: "5px"}):
      ({height: this.props.height + "px", width: "5px"});

    return (
      <div
        className="lsd-slider"
        style={styleValue}
        ref={(ref) => this.componentInstance = ref}>
        <LsdSliderRange />
        <LsdSliderThumb
          containerHeight={this.props.height}
          containerWidth={this.props.width}
          containerPosition={this.state.position}
          orientation={this.state.orientation}/>
      </div>
    );
  }
});

ReactDOM.render(
  <LsdSlider key="1" height="200" width="300"/>,
  document.getElementById('lsd-slider-1')
);

ReactDOM.render(
  <LsdSlider key="2" height="200" width="0"/>,
  document.getElementById('lsd-slider-2')
);