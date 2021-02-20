// ==UserScript==
// @namespace    https://github.com/avalenti89/march-of-history/
// @exclude *
// ==UserLibrary==
// @name         March of History - utilities
// @version      0.1.0
// @description  Many usefull scripts used to run UserScripts
// @copyright    2021, avalenti89 (https://openuserjs.org/users/avalenti89)
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// ==/UserScript==
// ==/UserLibrary==
/* jshint esversion: 6 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var moh_utils = (function () {
    var cleanText = function (text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };
    var checkChildMutation = function (target, needle, callback) {
        var observer = new MutationObserver(function (mutationsList) {
            var e_1, _a;
            try {
                for (var mutationsList_1 = __values(mutationsList), mutationsList_1_1 = mutationsList_1.next(); !mutationsList_1_1.done; mutationsList_1_1 = mutationsList_1.next()) {
                    var mutation = mutationsList_1_1.value;
                    if (mutation.type == "childList") {
                        if (mutation.target.matches(needle)) {
                            callback(mutation.target);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (mutationsList_1_1 && !mutationsList_1_1.done && (_a = mutationsList_1.return)) _a.call(mutationsList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        if (typeof target === "string") {
            target = document.querySelector(target);
        }
        observer.observe(target, { childList: true, subtree: true });
        return observer;
    };
    var checkAttributeMutation = function (target, attributeName, callback) {
        var observer = new MutationObserver(function (mutationsList) {
            var e_2, _a;
            try {
                for (var mutationsList_2 = __values(mutationsList), mutationsList_2_1 = mutationsList_2.next(); !mutationsList_2_1.done; mutationsList_2_1 = mutationsList_2.next()) {
                    var mutation = mutationsList_2_1.value;
                    if (mutation.type == "attributes" &&
                        mutation.attributeName === attributeName) {
                        callback(mutation.target.getAttribute(attributeName));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (mutationsList_2_1 && !mutationsList_2_1.done && (_a = mutationsList_2.return)) _a.call(mutationsList_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
        if (typeof target === "string") {
            target = document.querySelector(target);
        }
        observer.observe(target, { attributes: true });
        return observer;
    };
    var cities = [];
    var collectCities = function () {
        var _cities = [];
        console.log("collecting cities");
        var list = document.querySelector(".tabsCarte #tabs-1 .accordion");
        if (!list)
            return [];
        var citiesElement = list.querySelectorAll("h3");
        var dataElements = list.querySelectorAll(".accordeonItem");
        citiesElement.forEach(function (el) {
            var id = cleanText(el.id);
            var _title = el.querySelector("a.accordeonTitre");
            if (!_title)
                return;
            var cityName = cleanText(_title.innerText).replace("seignory of ", "");
            var found = Array.from(dataElements).find(function (el) {
                var aria = cleanText(el.getAttribute("aria-labelledby"));
                return aria === id;
            });
            if (found) {
                var wrapper = found.querySelector(".accordeonItemWrapper");
                if (!wrapper)
                    return;
                var action = wrapper.querySelector(".action[data-idville]");
                if (!action)
                    return;
                var idCity = Number(action.getAttribute("data-idville"));
                var population = Number(found
                    .querySelector(".menuVillageRessourcesElement")
                    .innerText.trim());
                _cities.push({ name: cityName, population: population, id: idCity });
            }
        });
        console.log("collected cities");
        cities = _cities;
        return _cities;
    };
    moh_utils.checkChildMutation("body", "#ecranCarte", function () {
        collectCities();
    });
    return {
        cleanText: cleanText,
        checkChildMutation: checkChildMutation,
        checkAttributeMutation: checkAttributeMutation,
        collectCities: collectCities,
        cities: cities,
    };
})();
window.moh_utils = moh_utils;
