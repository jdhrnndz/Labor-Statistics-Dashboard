/** @jsx React.DOM */
'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var LsdSlider = require('./scripts/LsdSlider.jsx')

var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
      top += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while(element);

    return ({
      top: top,
      left: left
    });
  }

ReactDOM.render(
  <LsdSlider key="1" width="300" multiple="4" min="1" max="8" cumulativeOffset={cumulativeOffset}/>,
  document.getElementById('lsd-slider-1')
);

ReactDOM.render(
  <LsdSlider key="2" height="240" multiple="3" cumulativeOffset={cumulativeOffset}/>,
  document.getElementById('lsd-slider-2')
);