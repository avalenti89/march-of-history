// ==UserScript==
// @name        march-of-history
// @description March of history game scripts
// @namespace   github.com/avalenti89
// @require     https://unpkg.com/react@17/umd/react.development.js
// @require     https://unpkg.com/react-dom@17/umd/react-dom.development.js
// @include     https://github.com/*
// @version     1.0.0
// @homepage    https://github.com/avalenti89/march-of-history
// @author      avalenti89
// @license     MIT
// @grant       GM.getValue
// ==/UserScript==

/*
MIT License

Copyright (c) 2021 a.valenti.89

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* globals React, ReactDOM */
(function (React, ReactDom) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var ReactDom__default = /*#__PURE__*/_interopDefaultLegacy(ReactDom);

    var Tools = function () {
        return React__default['default'].createElement("div", null, "Tool");
    };

    ReactDom__default['default'].render(React__default['default'].createElement(Tools, null), document.body);

}(React, ReactDOM));
//# sourceMappingURL=bundle.user.js.map
