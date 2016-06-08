"use strict";

var util = require("lens/substance/util");
var LensConverter = require('lens/converter');
var path = require('path')
var _ = require('underscore')

var SciFairEuPmcConverter = function(options) {
  LensConverter.call(this, options);
};

SciFairEuPmcConverter.Prototype = function() {

  var __super__ = LensConverter.prototype;

  this.test = function(xmlDoc, documentUrl) {
    // save the doc url inside the doc so we can access it later
    xmlDoc.documentUrl = documentUrl
    return /PMC/.test(documentUrl)
  };

  // Resolve asset urls
  // --------
  //

  this.getAssetUrl = function(assetpath, state) {
    var relative_dir = path.dirname(state.xmlDoc.documentUrl)
    return relative_dir + '/figures/' + assetpath
  }

  this.enhanceFigure = function(state, node, element) {
    console.log(state.xmlDoc.documentUrl)
    var graphic = element.querySelector("graphic");
    var url = graphic.getAttribute("xlink:href");
    url = [
      url,
      '.jpg'
    ].join('');
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

  this.formula = function(state, formulaElement, inline) {
    var doc = state.doc;
    var formulaNode = {
      id: state.nextId("formula"),
      source_id: formulaElement.getAttribute("id"),
      type: "formula",
      label: "",
      inline: !!inline,
      data: [],
      format: [],
    };
    var label = formulaElement.querySelector("label");
    if (label) formulaNode.label = label.textContent;
    var formulaData = this._getFormulaData(
      formulaElement,
      inline,
      state
    );
    for (var i = 0; i < formulaData.length; i++) {
      formulaNode.format.push(formulaData[i].format);
      formulaNode.data.push(formulaData[i].data);
    }
    doc.create(formulaNode);
    return formulaNode;
  };

  // Handle EuPMC citations nicely by adding `citation` type
  this.citationTypes = {
    "mixed-citation": true,
    "element-citation": true,
    "citation": true
  };

  this.affiliation = function(state, aff) {
    var doc = state.doc;

    var institution = aff.querySelector("institution");
    var country = aff.querySelector("country");
    var label = aff.querySelector("label");
    var department = aff.querySelector("addr-line named-content[content-type=department]");
    var city = aff.querySelector("addr-line named-content[content-type=city]");

    // TODO: this is a potential place for implementing a catch-bin
    // For that, iterate all children elements and fill into properties as needed or add content to the catch-bin

    var affiliationNode = {
      id: state.nextId("affiliation"),
      type: "affiliation",
      source_id: aff.getAttribute("id"),
      label: label ? label.textContent : null,
      department: department ? department.textContent : null,
      city: city ? city.textContent : null,
      institution: institution ? institution.textContent : null,
      country: country ? country.textContent: null
    };
    doc.create(affiliationNode);
  };

  this.contribGroup = function(state, contribGroup) {
    console.log(contribGroup)
    var i;
    var contribs = contribGroup.querySelectorAll("contrib");
    for (i = 0; i < contribs.length; i++) {
      this.contributor(state, contribs[i]);
    }
    // Extract on-behalf-of element and stick it to the document
    var doc = state.doc;
    var onBehalfOf = contribGroup.querySelector("on-behalf-of");
    if (onBehalfOf) doc.on_behalf_of = onBehalfOf.textContent.trim();
  };

};

SciFairEuPmcConverter.Prototype.prototype = LensConverter.prototype;
SciFairEuPmcConverter.prototype = new SciFairEuPmcConverter.Prototype();
SciFairEuPmcConverter.prototype.constructor = SciFairEuPmcConverter;

module.exports = SciFairEuPmcConverter;
