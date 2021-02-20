// ==UserScript==
// @namespace    https://github.com/avalenti89/march-of-history/
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

interface City {
  id: number;
  name: string;
  population: number;
}

const moh_utils = (() => {
  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const checkChildMutation = (
    target: Element | string,
    needle: string,
    callback: (element: Element) => void
  ) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type == "childList") {
          if ((mutation.target as Element).matches(needle)) {
            callback(mutation.target as Element);
          }
        }
      }
    });
    if (typeof target === "string") {
      target = document.querySelector(target);
    }
    observer.observe(target, { childList: true, subtree: true });

    return observer;
  };

  const checkAttributeMutation = (
    target: Element | string,
    attributeName: string,
    callback: (attribute: any) => void
  ) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type == "attributes" &&
          mutation.attributeName === attributeName
        ) {
          callback((mutation.target as Element).getAttribute(attributeName));
        }
      }
    });
    if (typeof target === "string") {
      target = document.querySelector(target);
    }
    observer.observe(target, { attributes: true });
    return observer;
  };

  let cities: Array<City> = [];

  const collectCities = () => {
    let _cities: Array<City> = [];
    console.log("collecting cities");
    const list = document.querySelector(".tabsCarte #tabs-1 .accordion");
    if (!list) return [];
    const citiesElement = list.querySelectorAll("h3");
    const dataElements = list.querySelectorAll(".accordeonItem");
    citiesElement.forEach((el) => {
      const id = cleanText(el.id);
      const _title = el.querySelector<HTMLElement>("a.accordeonTitre");
      if (!_title) return;
      const cityName = cleanText(_title.innerText).replace("seignory of ", "");
      const found = Array.from(dataElements).find((el) => {
        const aria = cleanText(el.getAttribute("aria-labelledby"));
        return aria === id;
      });
      if (found) {
        const wrapper = found.querySelector(".accordeonItemWrapper");
        if (!wrapper) return;
        const action = wrapper.querySelector(".action[data-idville]");
        if (!action) return;
        const idCity = Number(action.getAttribute("data-idville"));
        const population = Number(
          found
            .querySelector<HTMLElement>(".menuVillageRessourcesElement")
            .innerText.trim()
        );
        _cities.push({ name: cityName, population, id: idCity });
      }
    });

    console.log("collected cities");
    cities = _cities;
    return _cities;
  };

  moh_utils.checkChildMutation("body", "#ecranCarte", () => {
    collectCities();
  });

  return {
    cleanText,
    checkChildMutation,
    checkAttributeMutation,
    collectCities,
    cities,
  };
})();

interface Window {
  moh_utils: typeof moh_utils;
}
window.moh_utils = moh_utils;
