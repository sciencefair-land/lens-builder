"use strict";

var Lens = require("lens");
var panels = Lens.getDefaultPanels();

// Custom Panels
// -------------------
// 
// Uncomment the following lines to enable the altmetrics panel
// which can be considered a demo implementation for a custom
// panel in Lens
// 
// Find the code in panels/altmetrics and use it as an inspiration
// to build your own Lens panel

var altmetricsPanel = require('./panels/altmetrics');

// Insert altmetrics panel at next to last position
panels.splice(-1, 0, altmetricsPanel);

var LensApp = function(config) {
  Lens.call(this, config);
};

LensApp.Prototype = function() {

  this.getPanels = function() {
    return panels.slice(0);
  };
};

LensApp.Prototype.prototype = Lens.prototype;
LensApp.prototype = new LensApp.Prototype();
LensApp.prototype.constructor = LensApp;

module.exports = LensApp;