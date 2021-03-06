"use strict";
// ==UserScript==
// @name         March of History - auto collect taxes
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.3
// @description  Auto collect taxes from windmill and court when enter in a signoury
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// ==/UserScript==
/* jshint esversion: 6 */
console.log("Auto collect taxes", "script loaded");
var moh_auto_collect_taxes = (function () {
    var collectWindMillTaxes = function () {
        var _a;
        var _b = window.ville, moulin = _b.moulin, batiments = _b.batiments;
        if ((_a = batiments === null || batiments === void 0 ? void 0 : batiments[moulin.ID]) === null || _a === void 0 ? void 0 : _a.recoltable) {
            console.log("Collecting Windmill");
            moulin.recupererTaxes();
            batiments[moulin.ID].recoltable = false;
        }
    };
    var collectCourtTaxes = function () {
        var _a;
        var _b = window.ville, tribunal = _b.tribunal, batiments = _b.batiments;
        if ((_a = batiments[tribunal.ID]) === null || _a === void 0 ? void 0 : _a.recoltable) {
            console.log("Collecting Court");
            tribunal.recupererTaxes();
            batiments[tribunal.ID].recoltable = false;
        }
    };
    MoH_Utils.setListenerVille(function (ville) {
        var _a, _b;
        if ((_a = ville.moulin) === null || _a === void 0 ? void 0 : _a.ID) {
            collectWindMillTaxes();
        }
        if ((_b = ville.tribunal) === null || _b === void 0 ? void 0 : _b.ID) {
            collectCourtTaxes();
        }
    });
    return {
        collectWindMillTaxes: collectWindMillTaxes,
    };
})();
window.moh_auto_collect_taxes = moh_auto_collect_taxes;
