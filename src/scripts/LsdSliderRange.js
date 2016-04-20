/* jshint esversion: 6 */

/*
*  LsdSliderRange React Component
*  States:
*    none
*  Props:
*    orientation: [string]
*    position: [float]
*    length: [float]
*    dimension: [JSON Object] {
*      width: [float]
*      height: [float]
*    }
*/
const LsdSliderRange = React.createClass({
  render: function() {
    let style = (this.props.orientation === "x")?
      {
        width: this.props.length + "%",
        height: this.props.dimension.height + "px",
        left: this.props.position + "%"
      }:
      {
        width: this.props.dimension.width + "px",
        height: this.props.length + "%",
        top: this.props.position + "%"
      };
    return (
      <div
        className="lsd-slider-range"
        style={style}/>
    );
  }
});

export default LsdSliderRange;
export { LsdSliderRange };
