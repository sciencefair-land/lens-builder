"use strict";

var util = require("lens/substance/util");
var LensConverter = require('lens/converter');
var path = require('path')

var SciFairEuPmcConverter = function(options) {
  LensConverter.call(this, options);
};

SciFairEuPmcConverter.Prototype = function() {

  var __super__ = LensConverter.prototype;

  this.test = function(xmlDoc, documentUrl) {
    xmlDoc.documentUrl = documentUrl
    return /PMC[0-9]+/.test(documentUrl)
  };

  // Resolve figure urls
  // --------
  //

  this.enhanceFigure = function(state, node, element) {
    var relative_dir = path.dirname(state.xmlDoc.documentUrl)
    var graphic = element.querySelector("graphic");
    var url = graphic.getAttribute("xlink:href");
    url = [
      url,
      '.jpg'
    ].join('');
    node.url = path.join(relative_dir, 'figures', url);
  };

  // Handle EuPMC citations nicely by adding `citation` type
  this.citationTypes = {
    "mixed-citation": true,
    "element-citation": true,
    "citation": true
  };


};

SciFairEuPmcConverter.Prototype.prototype = LensConverter.prototype;
SciFairEuPmcConverter.prototype = new SciFairEuPmcConverter.Prototype();
SciFairEuPmcConverter.prototype.constructor = SciFairEuPmcConverter;

module.exports = SciFairEuPmcConverter;
