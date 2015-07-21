"use strict";

var Lens = require("lens/reader");
var panels = Lens.getDefaultPanels();
  
// All available converters
var LensConverter = require("lens/converter");
var CustomConverter = require("./custom_converter");
var ElifeConverter = require("lens/converter/elife_converter");

// Custom Panels
// -------------------
// 
// The following lines enable the altmetrics panel
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

  // Custom converters
  // --------------
  // 
  // Provides a sequence of converter instances
  // Converter.match will be called on each instance with the
  // XML document to processed. The one that returns true first
  // will be chosen. You can change the order prioritize
  // converters over others

  this.getConverters = function(converterOptions) {
    return [
      new CustomConverter(converterOptions),
      new ElifeConverter(converterOptions),
      new LensConverter(converterOptions)
    ]
  };

  // Custom panels
  // --------------
  // 

  this.getPanels = function() {
    return panels.slice(0);
  };
};

LensApp.Prototype.prototype = Lens.prototype;
LensApp.prototype = new LensApp.Prototype();
LensApp.prototype.constructor = LensApp;

module.exports = LensApp;