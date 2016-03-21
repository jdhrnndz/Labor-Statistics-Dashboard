var LSDSliderVertical = React.createClass({
  getInitialState: function(){
    return ({
      dragging: false,
      top: 0
    });
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
  dragEvent: function() {
    if (this.state.dragging){
      this.setState({top: this.state.top+1});
      console.log(mouseXY);
    }
    console.log(cumulativeOffset(this.componentInstance));
  },
  render: function() {
    var topValue = this.state.top;
    var heightValue = this.props.height;
    return (
      <div
        className="lsd-slider-vertical"
        style={{height: heightValue}}
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

ReactDOM.render( < LSDSliderVertical key="1" height="200px"/ > ,
  document.getElementById('lsd-slider-vertical-1')
);

ReactDOM.render( < LSDSliderVertical key="2" height="200px"/ > ,
  document.getElementById('lsd-slider-vertical-2')
);