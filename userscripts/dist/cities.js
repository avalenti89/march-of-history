"use strict";
// ==UserScript==
// @namespace    https://github.com/avalenti89/march-of-history/
// @exclude *
// ==UserLibrary==
// @name         March of History - cities
// @version      0.1.1
// @description  Cities information and utilities
// @copyright    2021, avalenti89 (https://openuserjs.org/users/avalenti89)
// @author       avalenti89
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// @grant        none
// @license      MIT
// @run-at       document-end
// ==/UserScript==
// ==/UserLibrary==
/* jshint esversion: 6 */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var Cities = /** @class */ (function () {
    function Cities() {
        var _this = this;
        this.cities = [];
        this.collectCities = function () {
            var _cities = [];
            console.log("collecting cities");
            var list = document.querySelector(".tabsCarte #tabs-1 .accordion");
            var citiesElement = list === null || list === void 0 ? void 0 : list.querySelectorAll("h3");
            var dataElements = list === null || list === void 0 ? void 0 : list.querySelectorAll(".accordeonItem");
            if (!dataElements)
                return;
            citiesElement === null || citiesElement === void 0 ? void 0 : citiesElement.forEach(function (el) {
                var _a;
                var id = MoH_Utils.cleanText(el.id);
                var _title = el.querySelector("a.accordeonTitre");
                if (!_title)
                    return;
                var cityName = MoH_Utils.cleanText(_title.innerText).replace("seignory of ", "");
                var found = Array.from(dataElements).find(function (el) {
                    var _a;
                    var aria = MoH_Utils.cleanText((_a = el.getAttribute("aria-labelledby")) !== null && _a !== void 0 ? _a : "");
                    return aria === id;
                });
                if (found) {
                    var wrapper = found.querySelector(".accordeonItemWrapper");
                    var action = wrapper === null || wrapper === void 0 ? void 0 : wrapper.querySelector(".action[data-idville]");
                    var idCity = Number(action === null || action === void 0 ? void 0 : action.getAttribute("data-idville"));
                    var population = Number((_a = found
                        .querySelector(".menuVillageRessourcesElement")) === null || _a === void 0 ? void 0 : _a.innerText.trim());
                    _cities.push({ name: cityName, population: population, id: idCity });
                }
            });
            console.log("collected cities");
            _this.cities = _cities;
        };
        MoH_Utils.checkPageChange("#ecranCarte", function () {
            _this.collectCities();
        });
    }
    Cities.prototype.sortBy = function (key, desc) {
        return __spread(this.cities).sort(function (a, b) {
            var aValue = a[key !== null && key !== void 0 ? key : "name"];
            var bValue = b[key !== null && key !== void 0 ? key : "name"];
            if (typeof aValue === "undefined" && typeof bValue === "undefined")
                return 0;
            else if (typeof aValue !== "undefined" && typeof bValue === "undefined")
                return -1;
            else if (typeof aValue === "undefined" && typeof bValue !== "undefined")
                return 1;
            else if (aValue < bValue)
                return desc ? 1 : -1;
            else if (aValue > bValue)
                return desc ? -1 : 1;
            else if (a.name < b.name)
                return -1;
            else if (a.name > b.name)
                return 0;
            return 0;
        });
    };
    return Cities;
}());
var moh_cities = new Cities();
window.moh_cities = moh_cities;
