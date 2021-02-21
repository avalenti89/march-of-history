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

class MoH_Utils {
  static cleanText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  static checkChildMutation = (
    target: HTMLElement | string,
    needle: string,
    callback: (element: HTMLElement) => void
  ) => {
    let _target: HTMLElement | null =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (!_target) {
      return void 0;
    }

    const needleEl = document.querySelector<HTMLElement>(needle);
    if (needleEl) {
      callback(needleEl);
    }
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type == "childList") {
          if ((mutation.target as HTMLElement).matches?.(needle)) {
            console.log("Found", needle);
            callback(mutation.target as HTMLElement);
          }
        }
      }
    });
    observer.observe(_target, { childList: true, subtree: true });

    return observer;
  };

  static checkPageChange = (
    needle: string,
    callback: (element: HTMLElement) => void
  ) => {
    const _target = document.querySelector("#contenu");
    if (!_target) {
      return void 0;
    }

    const needleEl = document.querySelector<HTMLElement>(needle);
    if (needleEl) {
      callback(needleEl);
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if ((node as HTMLElement).matches?.(needle)) {
            console.log("Found added", needle);
            callback(mutation.target as HTMLElement);
          }
        }
      }
    });
    observer.observe(_target, { childList: true });

    return observer;
  };

  static checkAttributeMutation = (
    target: HTMLElement | string,
    needle: string,
    callback: (attribute: string | null) => void
  ) => {
    let _target: HTMLElement | null =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (!_target) {
      return void 0;
    } else {
      callback(_target.getAttribute(needle));
    }

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type == "attributes" &&
          mutation.attributeName === needle
        ) {
          console.log("Found attribute", needle);
          callback((mutation.target as HTMLElement).getAttribute(needle));
        }
      }
    });

    observer.observe(_target, { attributes: true });
    return observer;
  };
}

interface Window {
  moh_utils: MoH_Utils;
}

window.moh_utils = MoH_Utils;
