// ==UserScript==
// @name        march-of-history [dev]
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
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// ==/UserScript==
/*  globals GM */

'use strict';

(function () {
  const url = `http://localhost:8124/bundle.user.js?${Date.now()}`
  new Promise(function loadBundleFromServer (resolve, reject) {
    GM.xmlHttpRequest({
      url: url,
      onload: function (r) {
        if (r.status !== 200) {
          return reject(r)
        }
        resolve(r.responseText)
      },
      onerror: e => reject(e)
    }).catch(e => { /* ignore */ })
  }).catch(function (e) {
    const log = function (obj, b) {
      let prefix = 'loadBundleFromServer: '
      try {
        prefix = GM.info.script.name + ': '
      } catch (e) {}
      if (b) {
        console.log(prefix + obj, b)
      } else {
        console.log(prefix, obj)
      }
    }
    if (e && 'status' in e) {
      if (e.status <= 0) {
        log('Server is not responding')
        GM.getValue('scriptlastsource3948218', false).then(function (src) {
          if (src) {
            log('%cExecuting cached script version', 'color: Crimson; font-size:x-large;')
            /* eslint-disable no-eval */
            eval(src)
          }
        })
      } else {
        log('HTTP status: ' + e.status)
      }
    } else {
      log(e)
    }
  }).then(function (s) {
    if (s) {
      /* eslint-disable no-eval */
      eval(`${s}
//# sourceURL=${url}`)
      GM.setValue('scriptlastsource3948218', s)
    }
  })
})()