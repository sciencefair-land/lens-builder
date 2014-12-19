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

var altmetricsPanel = require('./panels/altmetrics/altmetrics_panel');

// Insert altmetrics panel at next to last position
panels.splice(-1, 0, altmetricsPanel);

var ElifeLens = function(config) {
  Lens.call(this, config);
};

ElifeLens.Prototype = function() {

  this.getPanels = function() {
    return panels.slice(0);
  };
};

ElifeLens.Prototype.prototype = Lens.prototype;
ElifeLens.prototype = new ElifeLens.Prototype();
ElifeLens.prototype.constructor = ElifeLens;

module.exports = ElifeLens;