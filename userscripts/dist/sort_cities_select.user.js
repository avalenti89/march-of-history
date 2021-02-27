"use strict";
// ==UserScript==
// @name         March of History - sort cities select
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.7
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
console.log("Sort Cities select", "script loaded");
var moh_sort_cities_select = (function () {
    var sortKey = "population";
    var sortDesc = true;
    var sortedCities = [];
    var getSortedCities = function () {
        var list = document.querySelector("#villeListeVilles ul");
        var elements = list === null || list === void 0 ? void 0 : list.querySelectorAll("li");
        if (!(elements === null || elements === void 0 ? void 0 : elements.length))
            return;
        console.log("sorting by " + sortKey + (sortDesc ? "desc" : ""));
        sortedCities = moh_cities.cities.length
            ? moh_cities.sortBy(sortKey, sortDesc)
            : __spread(elements).reduce(function (prev, el) {
                var _a, _b;
                var action = el.querySelector(".action");
                var id = action === null || action === void 0 ? void 0 : action.getAttribute("data-idville");
                var name = MoH_Utils.cleanText((_b = (_a = el.querySelector(".deroulantVillesNomProvince")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "").replace("seignory of ", "");
                if (!id || !name)
                    return prev;
                var city = {
                    id: Number(id),
                    name: name,
                };
                return __spread(prev, [city]);
            }, [])
                .sort(function (a, b) { return a.name.localeCompare(b.name); });
    };
    var sortSelect = function () {
        var list = document.querySelector("#villeListeVilles ul");
        var elements = list === null || list === void 0 ? void 0 : list.querySelectorAll("li");
        if (!(elements === null || elements === void 0 ? void 0 : elements.length))
            return;
        console.log("sorting by " + sortKey + (sortDesc ? "desc" : ""));
        var sortedNames = sortedCities.map(function (city) { return city.name; });
        var sorted = __spread(elements).sort(function (a, b) {
            var _a, _b, _c, _d;
            var textA = MoH_Utils.cleanText((_b = (_a = a.querySelector(".deroulantVillesNomProvince")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "").replace("seignory of ", "");
            var textB = MoH_Utils.cleanText((_d = (_c = b.querySelector(".deroulantVillesNomProvince")) === null || _c === void 0 ? void 0 : _c.innerText) !== null && _d !== void 0 ? _d : "").replace("seignory of ", "");
            var priorA = sortedNames.findIndex(function (val) { return textA.includes(val); });
            var priorB = sortedNames.findIndex(function (val) { return textB.includes(val); });
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
        var currentCityElement = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince");
        if (!currentCityElement)
            return;
        var currentCityName = MoH_Utils.cleanText(currentCityElement.innerHTML).replace("seignory of ", "");
        var currentCity_index = sortedCities.findIndex(function (city) {
            return city.name === currentCityName;
        });
        var prev_city = (_a = sortedCities[currentCity_index - 1]) !== null && _a !== void 0 ? _a : sortedCities[sortedCities.length - 1];
        var next_city = (_b = sortedCities[currentCity_index + 1]) !== null && _b !== void 0 ? _b : sortedCities[0];
        if (next_city.id && prev_city.id) {
            var prev_city_button = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelLeft.action");
            var next_city_button = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelRight.action");
            if (!prev_city_button || !next_city_button)
                return;
            prev_city_button.setAttribute("data-idville", prev_city.id.toString());
            prev_city_button.setAttribute("title", prev_city.name);
            next_city_button.setAttribute("data-idville", next_city.id.toString());
            next_city_button.setAttribute("title", next_city.name);
        }
    };
    var run = function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var _b = __read(_a, 2), _sortKey = _b[0], _desc = _b[1];
        sortKey = _sortKey !== null && _sortKey !== void 0 ? _sortKey : sortKey;
        sortDesc = _desc !== null && _desc !== void 0 ? _desc : sortDesc;
        getSortedCities();
        sortSelect();
        setArrows();
    };
    MoH_Utils.checkPageChange("#ecranVille", function () {
        run();
    });
    return {
        sortKey: sortKey,
        sortDesc: sortDesc,
        run: run,
        sortSelect: sortSelect,
        setArrows: setArrows,
    };
})();
window.moh_sort_cities_select = moh_sort_cities_select;
