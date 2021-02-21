"use strict";
// ==UserScript==
// @namespace    https://github.com/avalenti89/march-of-history/
// @exclude *
// ==UserLibrary==
// @name         March of History - utilities
// @version      0.1.3
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
var MoH_Utils = /** @class */ (function () {
    function MoH_Utils() {
    }
    MoH_Utils.cleanText = function (text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };
    MoH_Utils.checkChildMutation = function (target, needle, callback) {
        var _target = typeof target === "string"
            ? document.querySelector(target)
            : target;
        if (!_target) {
            return void 0;
        }
        var needleEl = document.querySelector(needle);
        if (needleEl) {
            callback(needleEl);
        }
        var observer = new MutationObserver(function (mutationsList) {
            var e_1, _a;
            var _b, _c;
            try {
                for (var mutationsList_1 = __values(mutationsList), mutationsList_1_1 = mutationsList_1.next(); !mutationsList_1_1.done; mutationsList_1_1 = mutationsList_1.next()) {
                    var mutation = mutationsList_1_1.value;
                    if (mutation.type == "childList") {
                        if ((_c = (_b = mutation.target).matches) === null || _c === void 0 ? void 0 : _c.call(_b, needle)) {
                            console.log("Found", needle);
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
        observer.observe(_target, { childList: true, subtree: true });
        return observer;
    };
    MoH_Utils.checkPageChange = function (needle, callback) {
        var _target = document.querySelector("#contenu");
        if (!_target) {
            return void 0;
        }
        var needleEl = document.querySelector(needle);
        if (needleEl) {
            callback(needleEl);
        }
        var observer = new MutationObserver(function (mutationsList) {
            var e_2, _a, e_3, _b;
            var _c, _d;
            try {
                for (var mutationsList_2 = __values(mutationsList), mutationsList_2_1 = mutationsList_2.next(); !mutationsList_2_1.done; mutationsList_2_1 = mutationsList_2.next()) {
                    var mutation = mutationsList_2_1.value;
                    try {
                        for (var _e = (e_3 = void 0, __values(mutation.addedNodes)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var node = _f.value;
                            if ((_d = (_c = node).matches) === null || _d === void 0 ? void 0 : _d.call(_c, needle)) {
                                console.log("Found added", needle);
                                callback(mutation.target);
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
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
        observer.observe(_target, { childList: true });
        return observer;
    };
    MoH_Utils.checkAttributeMutation = function (target, needle, callback) {
        var _target = typeof target === "string"
            ? document.querySelector(target)
            : target;
        if (!_target) {
            return void 0;
        }
        else {
            callback(_target.getAttribute(needle));
        }
        var observer = new MutationObserver(function (mutationsList) {
            var e_4, _a;
            try {
                for (var mutationsList_3 = __values(mutationsList), mutationsList_3_1 = mutationsList_3.next(); !mutationsList_3_1.done; mutationsList_3_1 = mutationsList_3.next()) {
                    var mutation = mutationsList_3_1.value;
                    if (mutation.type == "attributes" &&
                        mutation.attributeName === needle) {
                        console.log("Found attribute", needle);
                        callback(mutation.target.getAttribute(needle));
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (mutationsList_3_1 && !mutationsList_3_1.done && (_a = mutationsList_3.return)) _a.call(mutationsList_3);
                }
                finally { if (e_4) throw e_4.error; }
            }
        });
        observer.observe(_target, { attributes: true });
        return observer;
    };
    return MoH_Utils;
}());
window.moh_utils = MoH_Utils;
