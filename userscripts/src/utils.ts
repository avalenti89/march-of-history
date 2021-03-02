// ==UserScript==
// @namespace    https://github.com/avalenti89/march-of-history/
// @exclude *
// ==UserLibrary==
// @name         March of History - utilities
// @version      0.1.5
// @description  Many usefull scripts used to run UserScripts
// @copyright    2021, avalenti89 (https://openuserjs.org/users/avalenti89)
// @author       avalenti89
// @grant        none
// @license      MIT
// @run-at       document-start
// ==/UserScript==
// ==/UserLibrary==
/* jshint esversion: 6 */

const isProxy = Symbol("isProxy");
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
    console.log("Looking for child", needle);
    let _target: HTMLElement | null =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (!_target) {
      console.log("Not found", target);
      return void 0;
    }

    const needleEl = document.querySelector<HTMLElement>(needle);
    if (needleEl) {
      console.log("Found child", needle);
      callback(needleEl);
    }
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type == "childList") {
          if ((mutation.target as HTMLElement).matches?.(needle)) {
            console.log("Found child", needle);
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
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if ((node as HTMLElement).matches?.(needle)) {
            console.log("Found page", needle);
            callback(mutation.target as HTMLElement);
          }
        }
      }
    });
    const bodyObserver = MoH_Utils.checkChildMutation(
      "body",
      "#contenu",
      () => {
        console.log("Looking for page", needle);
        const _target = document.querySelector("#contenu");
        if (_target) {
          bodyObserver?.disconnect();

          const needleEl = document.querySelector<HTMLElement>(needle);
          if (needleEl) {
            console.log("Found page", needle);
            callback(needleEl);
          }
          observer.observe(_target, { childList: true });
        }
      }
    );

    return observer;
  };

  static checkAttributeMutation = (
    target: HTMLElement | string,
    needle: string,
    callback: (attribute: string | null) => void
  ) => {
    console.log("Looking for attribute", needle);
    let _target: HTMLElement | null =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (!_target) {
      console.log("Not Found", target);
      return void 0;
    } else {
      console.log("Found attribute", needle);
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

  static setListenerVille = (callback: (value: Ville) => void) => {
    window.ville._listeners = window.ville._listeners ?? [];
    window.ville._on = function (callback: (ville: Ville) => void) {
      window.ville._listeners.push(callback);
      return () =>
        window.ville._listeners.filter(
          (_, index) => index === window.ville._listeners.indexOf(callback)
        );
    };
    window.ville._notify = function (ville: Ville) {
      window.ville._listeners.forEach((callback) => callback(ville));
    };

    window.ville._on(callback);

    if (window.ville.isProxy) {
      return;
    } else {
      window.ville.isProxy = isProxy;
      window.ville = new Proxy(window.ville, {
        get(target, prop, receiver) {
          if (prop === isProxy) {
            return true;
          }
          return Reflect.get(target, prop, receiver);
        },
        set(target, prop, val, receiver) {
          if (prop !== "_listeners" && prop !== "_on" && prop !== "_notify") {
            window.ville._notify(target);
          }
          return Reflect.set(target, prop, val, receiver);
        },
      });
    }
  };
}

interface Window {
  moh_utils: MoH_Utils;
}

window.moh_utils = MoH_Utils;
