// ==UserScript==
// @name         March of History - Sort cities select
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.4
// @description  Sort the cities list on select, based on population or priority/alphabetical
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-start
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
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
    var cities = moh_utils.cities, cleanText = moh_utils.cleanText, checkChildMutation = moh_utils.checkChildMutation;
    var priorityList = [];
    var sortType = "populations";
    var run = function () {
        sortSelect(sortType);
        setArrows();
    };
    checkChildMutation("body", "#ecranVille", function () {
        run();
    });
    var sortSelect = function (type) {
        var list = document.querySelector("#villeListeVilles ul");
        if (!list)
            return;
        var elements = list.querySelectorAll("li");
        console.log("sorting by " + type);
        var sortList = [];
        switch (type) {
            case "population":
                sortList = __spread(cities).sort(function (a, b) {
                    if (a.population < b.population)
                        return 1;
                    if (a.population > b.population)
                        return -1;
                    return 0;
                })
                    .map(function (city) { return city.name; });
                break;
            case "priority":
                sortList = priorityList;
        }
        var sorted = __spread(elements).sort(function (a, b) {
            var textA = cleanText(a.querySelector(".deroulantVillesNomProvince").innerText).replace("seignory of ", "");
            var textB = cleanText(b.querySelector(".deroulantVillesNomProvince").innerText).replace("seignory of ", "");
            var found = 0;
            var priorA = priorityList.findIndex(function (val) { return textA.includes(val); });
            var priorB = priorityList.findIndex(function (val) { return textB.includes(val); });
            if (priorA > 0 && priorB > 0) {
                if (priorA < priorB)
                    return -1;
                else if (priorA > priorB)
                    return 1;
                else
                    return 0;
            }
            if (priorA > 0 && priorB < 0)
                return -1;
            else if (priorB > 0 && priorA < 0)
                return 1;
            else if (textA < textB)
                return -1;
            else if (textA > textB)
                return 1;
            return 0;
        });
        elements.forEach(function (el) { return el.remove(); });
        sorted.forEach(function (el) {
            var action = el.querySelector(".action");
            el.title = moh_utils.cleanText(action.innerText) + " - " + action.getAttribute("data-idville");
            list.append(el);
        });
    };
    var setArrows = function () {
        var _a, _b;
        if (!cities.length)
            return;
        var currentCityElement = document.querySelector("#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince");
        if (!currentCityElement)
            return;
        var currentCityName = cleanText(currentCityElement.innerHTML).replace("seignory of ", "");
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
    return {
        priority: priorityList,
        sortType: sortType,
        run: run,
        sortSelect: sortSelect,
        setArrows: setArrows,
    };
})();
window.moh_sort_cities_select = moh_sort_cities_select;
