"use strict";

var util = require("lens/substance/util");
var LensConverter = require('lens/converter/elife_converter');
var path = require('path')
var _ = require('underscore')

var SciFaireLifeConverter = function(options) {
  LensConverter.call(this, options);
};

SciFaireLifeConverter.Prototype = function() {

  var __super__ = LensConverter.prototype;

  this.test = function(xmlDoc, documentUrl) {
    // save the doc url inside the doc so we can access it later
    xmlDoc.documentUrl = documentUrl
    return true
  };

  // Resolve asset urls
  // --------
  //

  this.getAssetUrl = function(assetpath, state) {
    var relative_dir = path.dirname(state.xmlDoc.documentUrl)
    return relative_dir + '/' + assetpath
  }

  this.enhanceFigure = function(state, node, element) {
    console.log(state.xmlDoc.documentUrl)
    var graphic = element.querySelector("graphic");
    if (graphic) {
      var url = graphic.getAttribute("xlink:href");
      if (url) {
        url = url
          .replace('http://cdn.elifesciences.org/elife-articles', '')
          .replace('.jpg.jpg', '.jpg')
          .replace('.tif.jpg', '.jpg')
        node.url = this.getAssetUrl(url, state)
      }
    }
  };

  // Catch-all implementation for figures et al.
this.extractFigures = function(state, xmlDoc) {
  // Globally query all figure-ish content, <fig>, <supplementary-material>, <table-wrap>, <media video>
  // mimetype="video"
  var body = xmlDoc.querySelector("body");

  if (body) {
    var figureElements = body.querySelectorAll("fig, table-wrap, supplementary-material, media[mimetype=video]");
    var nodes = [];
    for (var i = 0; i < figureElements.length; i++) {
      var figEl = figureElements[i];
      // skip converted elements
      if (figEl._converted) continue;
      var type = util.dom.getNodeType(figEl);
      var node = null;
      if (type === "fig") {
        node = this.figure(state, figEl);
      } else if (type === "table-wrap") {
        node = this.tableWrap(state, figEl);
      } else if (type === "media") {
        node = this.video(state, figEl);
      } else if (type === "supplementary-material") {
        node = this.supplement(state, figEl);
      }
      if (node) {
        nodes.push(node);
      }
    }
    this.show(state, nodes);
  }
};

};

SciFaireLifeConverter.Prototype.prototype = LensConverter.prototype;
SciFaireLifeConverter.prototype = new SciFaireLifeConverter.Prototype();
SciFaireLifeConverter.prototype.constructor = SciFaireLifeConverter;

module.exports = SciFaireLifeConverter;
