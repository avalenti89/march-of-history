"use strict";
// ==UserScript==
// @name         March of History - auto sell wood
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.0
// @description  Auto sell wood if the stock are full
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// ==/UserScript==
/* jshint esversion: 6 */
console.log("Auto sell wood", "script loaded");
var moh_auto_sell_woods = (function () {
    var sellWoods = function () {
        var unitPrice = window.ville.infos.cours.bois / 100;
        var quantity = 50;
        var ID = window.ville.infos.ID;
        window.bridge.sendArray({
            message: "actionMarche",
            action: "vend",
            ID: ID.toString(),
            ressource: "bois",
            quantite: quantity.toString(),
            prix: Math.round(unitPrice).toString(),
            IDDestinataire: ID.toString(),
        });
        window.ville.infos.stocks.bois = window.ville.infos.stocks.bois - 50;
    };
    MoH_Utils.setListenerVille(function (ville) {
        var _a, _b;
        var woodProd = (_b = (_a = Object.values(ville.batiments).find(function (b) { return b.type === 6; })) === null || _a === void 0 ? void 0 : _a.productionAnnuelle) !== null && _b !== void 0 ? _b : 0;
        var wood = ville.infos.stocks.bois;
        var maxWood = ville.infos.stocksMax.bois;
        var woodPrice = ville.infos.cours.bois;
        if (woodPrice > 640 && wood > maxWood - woodProd) {
            console.log("Selling Wood", wood, woodPrice, woodProd);
            sellWoods();
        }
    });
    return {
        sellWoods: sellWoods,
    };
})();
window.moh_auto_sell_woods = moh_auto_sell_woods;
