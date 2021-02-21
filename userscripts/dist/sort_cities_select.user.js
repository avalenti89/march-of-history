"use strict";
// ==UserScript==
// @name         March of History - sort cities select
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.5
// @description  Sort the cities list on select, based on population or priority/alphabetical
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_cities.js
// ==/UserScript==
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
console.log("script run");
var moh_sort_cities_select = (function () {
    var _sortKey = "population";
    var _sortDesc = true;
    var sortSelect = function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var _b = __read(_a, 2), sortKey = _b[0], desc = _b[1];
        var list = document.querySelector("#villeListeVilles ul");
        var elements = list === null || list === void 0 ? void 0 : list.querySelectorAll("li");
        if (!(elements === null || elements === void 0 ? void 0 : elements.length))
            return;
        console.log("sorting by " + sortKey + (desc ? "desc" : ""));
        var sortList = moh_cities.cities.length
            ? moh_cities.sortBy(sortKey, desc).map(function (city) { return city.name; })
            : __spread(elements).map(function (el) {
                var _a, _b;
                return MoH_Utils.cleanText((_b = (_a = el.querySelector(".deroulantVillesNomProvince")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "").replace("seignory of ", "");
            })
                .sort();
        var sorted = __spread(elements).sort(function (a, b) {
            var _a, _b, _c, _d;
            var textA = MoH_Utils.cleanText((_b = (_a = a.querySelector(".deroulantVillesNomProvince")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "").replace("seignory of ", "");
            var textB = MoH_Utils.cleanText((_d = (_c = b.querySelector(".deroulantVillesNomProvince")) === null || _c === void 0 ? void 0 : _c.innerText) !== null && _d !== void 0 ? _d : "").replace("seignory of ", "");
            var priorA = sortList.findIndex(function (val) { return textA.includes(val); });
            var priorB = sortList.findIndex(function (val) { return textB.includes(val); });
            return priorA - priorB;
        });
        elements.forEach(function (el) { return el.remove(); });
        sorted.forEach(function (el) {
            var action = el.querySelector(".action");
            if (!action)
                return;
            el.title = MoH_Utils.cleanText(action.innerText) + " - " + action.getAttribute("data-idville");
            list === null || list === void 0 ? void 0 : list.append(el);
        });
    };
    var setArrows = function () {
        var _a, _b;
        var cities = moh_cities.cities;
        // if (!cities.length) return;
        var currentCityElement = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince");
        if (!currentCityElement)
            return;
        var currentCityName = MoH_Utils.cleanText(currentCityElement.innerHTML).replace("seignory of ", "");
        var currentCity_index = cities.findIndex(function (city) {
            return city.name === currentCityName;
        });
        var prev_city = (_a = cities[currentCity_index - 1]) !== null && _a !== void 0 ? _a : cities[cities.length - 1];
        var prev_id = prev_city.id;
        var next_city = (_b = cities[currentCity_index + 1]) !== null && _b !== void 0 ? _b : cities[0];
        var next_id = next_city.id;
        if (next_id && prev_id) {
            var left = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelLeft.action");
            if (!left)
                return;
            left.setAttribute("data-idville", prev_id.toString());
            left.setAttribute("title", prev_city.name);
            var right = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelRight.action");
            if (!right)
                return;
            right.setAttribute("data-idville", next_id.toString());
            right.setAttribute("title", next_city.name);
        }
    };
    var run = function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var _b = __read(_a, 2), sortKey = _b[0], desc = _b[1];
        sortSelect(sortKey, desc);
        setArrows();
    };
    MoH_Utils.checkPageChange("#ecranVille", function () {
        run(_sortKey, _sortDesc);
    });
    return {
        _sortKey: _sortKey,
        _sortDesc: _sortDesc,
        run: run,
        sortSelect: sortSelect,
        setArrows: setArrows,
    };
})();
window.moh_sort_cities_select = moh_sort_cities_select;
