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
    return /elife/.test(documentUrl)
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
    var url = graphic.getAttribute("xlink:href");
    url = url
      .replace('http://cdn.elifesciences.org/elife-articles', '')
      .replace('.jpg.jpg', '.jpg')
      .replace('.tif.jpg', '.jpg')
    node.url = this.getAssetUrl(url, state)
  };

  this._getFormulaData = function(formulaElement, inline, state) {
    var result = [];
    for (var child = formulaElement.firstElementChild; child; child = child.nextElementSibling) {
      var type = util.dom.getNodeType(child);
      switch (type) {
        case "graphic":
        case "inline-graphic":
          result.push({
            format: 'image',
            data: this.getAssetUrl(child.getAttribute('xlink:href'), state)
          });
          break;
        case "svg":
          result.push({
            format: "svg",
            data: this.toHtml(child)
          });
          break;
        case "mml:math":
        case "math":
          result.push({
            format: "mathml",
            data: this.mmlToHtmlString(child)
          });
          break;
        case "tex-math":
          result.push({
            format: "latex",
            data: child.textContent
          });
          break;
        case "label":
          // Skipping - is handled in this.formula()
          break;
        default:
          console.error('Unsupported formula element of type ' + type);
      }
    }
    return result;
  };

};

SciFaireLifeConverter.Prototype.prototype = LensConverter.prototype;
SciFaireLifeConverter.prototype = new SciFaireLifeConverter.Prototype();
SciFaireLifeConverter.prototype.constructor = SciFaireLifeConverter;

module.exports = SciFaireLifeConverter;
