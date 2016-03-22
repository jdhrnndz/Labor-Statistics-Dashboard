var LSDSliderVertical = React.createClass({
  getInitialState: function(){
    return ({
      dragging: false,
      containerTop: 0,
      top: 0,
      left: 0
    });
  },
  componentWillMount: function() {
    document.addEventListener("mousemove", this.dragEvent);
    document.addEventListener("mouseup", this.dragStop);
  },
  componentDidMount: function() {
    var componentPosition = cumulativeOffset(this.componentInstance);
    this.setState({
      containerTop: componentPosition.top,
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
  dragEvent: function() {
    if (this.state.dragging){
      var verticalOffset = 5;
      var newTopValue = ((mouseXY.y-this.state.containerTop)/this.props.height)*100;
      var threshold = (verticalOffset/this.props.height)*100;
      this.setState({top: (newTopValue<0-verticalOffset)?0-verticalOffset:((newTopValue>100-verticalOffset)?100-verticalOffset:newTopValue)});
    }
  },
  render: function() {
    var topValue = this.state.top;
    var heightValue = this.props.height;
    return (
      <div
        className="lsd-slider-vertical"
        style={{height: heightValue+"px"}}
        ref={(ref) => this.componentInstance = ref}>
        <div
          className="lsd-slider-range"/>
        <span
          className="lsd-slider-thumb lsd-sun-handle"
          onMouseDown={this.dragStart}
          style={{top: topValue + "%"}}/> 
      </div>
    );
  }
});

ReactDOM.render( < LSDSliderVertical key="1" height="200"/ > ,
  document.getElementById('lsd-slider-vertical-1')
);

ReactDOM.render( < LSDSliderVertical key="2" height="200"/ > ,
  document.getElementById('lsd-slider-vertical-2')
);