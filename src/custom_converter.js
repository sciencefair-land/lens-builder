"use strict";

var util = require("substance-util");
var _ = require("underscore");
var LensConverter = require('lens-converter');

var LensArticle = require("lens-article");
var CustomNodeTypes = require("./nodes");

var CustomConverter = function(options) {
  LensConverter.call(this, options);
};

CustomConverter.Prototype = function() {

  var __super__ = LensConverter.prototype;

  this.test = function(xmlDoc, documentUrl) {
    var publisherName = xmlDoc.querySelector("publisher-name").textContent;
    return publisherName === "My Journal";
  };

  // Override document factory so we can create a customized Lens article,
  // including overridden node types
  this.createDocument = function() {
    var doc = new LensArticle({
      nodeTypes: CustomNodeTypes
    });
    return doc;
  };

  // Resolve figure urls
  // --------
  // 

  this.enhanceFigure = function(state, node, element) {
    var graphic = element.querySelector("graphic");
    var url = graphic.getAttribute("xlink:href");

    url = [
      "http://www.plosone.org/article/fetchObject.action?uri=",
      url,
      "&representation=PNG_L"
    ].join('');
    node.url = url;
  };

};

CustomConverter.Prototype.prototype = LensConverter.prototype;
CustomConverter.prototype = new CustomConverter.Prototype();
CustomConverter.prototype.constructor = CustomConverter;

module.exports = CustomConverter;
