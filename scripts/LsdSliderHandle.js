/* jshint esversion: 6 */

/*
*  LsdSliderHandle React Component
*  States:
*    dragging:  [boolean] Needed to be checked if the handle needs to be moved
*               because the mouse listener is declared globally.
*    position:  [JSON object] {
*      top: [float] Changed when a vertical slider handle is being dragged.
*      left: [float] Changed when a horizontal slider handle is being dragged.
*    }
*    dimension:  [JSON object] Offset dimension of the handle. {
*      width: [float] Obtained from offsetWidth HTML element property.
*      height: [float] Obtained from offsetHeight HTML element property.
*    }
*    borderWidth: [float] Used for offset
*  Props:
*    computeHandlePosition= [function] Used to get new position when dragging.
*    computeHandleOffset= [function] Uses the offset height/width of handle.
*    orientation: [string] "x" | "y" Determined by LsdSlider React Component.
*    initialValue: [float] Used to show multiple handles evenly distributed
*                  across the slider initially.
*/
const LsdSliderHandle = React.createClass({
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
      },
      dimension: {
        width: 0,
        height: 0
      },
      borderWidth: 0,
      handleOffset: 0
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
    *  Get the real value of the handle element. It factors in the width of the
    *  border and padding.
    */
    let newDimension = {
      width: this.componentInstance.offsetWidth,
      height: this.componentInstance.offsetHeight
    };

    let handleOffset = this.props.computeHandleOffset(newDimension);

    this.setState({
      dimension: newDimension,
      borderWidth: parseInt(getComputedStyle(this.componentInstance)
        .getPropertyValue("border-width")),
      handleOffset
    });
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

      let handlePos = this.props.computeHandlePosition(
        this.props.id,
        {
          x: event.pageX,
          y: event.pageY
        },
        this.state.dimension
      );
    }
  },
  render: function() {
    /*
    *  The long computation is for centering the handle with respect to the
    *  slider's orientation.
    */

    let style = (this.props.orientation === "x")?
      ({
        left: this.props.enforcedValue-this.state.handleOffset + "%",
        top: -(this.state.dimension.height-this.state.borderWidth)/2 + "px"
      }):
      ({
        top: this.props.enforcedValue-this.state.handleOffset + "%",
        left: -(this.state.dimension.width-this.state.borderWidth)/2 + "px"
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

export default LsdSliderHandle;
export { LsdSliderHandle };
