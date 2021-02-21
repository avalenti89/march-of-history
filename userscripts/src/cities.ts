// ==UserScript==
// @namespace    https://github.com/avalenti89/march-of-history/
// @exclude *
// ==UserLibrary==
// @name         March of History - cities
// @version      0.1.1
// @description  Cities information and utilities
// @copyright    2021, avalenti89 (https://openuserjs.org/users/avalenti89)
// @author       avalenti89
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// @grant        none
// @license      MIT
// @run-at       document-end
// ==/UserScript==
// ==/UserLibrary==
/* jshint esversion: 6 */

interface City {
  id: number;
  name: string;
  population: number;
  priority_order?: number;
}
class Cities {
  cities: Array<City> = [];
  constructor() {
    MoH_Utils.checkPageChange("#ecranCarte", () => {
      this.collectCities();
    });
  }
  collectCities = () => {
    let _cities: Array<City> = [];
    console.log("collecting cities");
    const list = document.querySelector(".tabsCarte #tabs-1 .accordion");
    const citiesElement = list?.querySelectorAll("h3");
    const dataElements = list?.querySelectorAll<HTMLElement>(".accordeonItem");
    if (!dataElements) return;
    citiesElement?.forEach((el) => {
      const id = MoH_Utils.cleanText(el.id);
      const _title = el.querySelector<HTMLElement>("a.accordeonTitre");
      if (!_title) return;
      const cityName = MoH_Utils.cleanText(_title.innerText).replace(
        "seignory of ",
        ""
      );
      const found = Array.from(dataElements).find((el: HTMLElement) => {
        const aria = MoH_Utils.cleanText(
          el.getAttribute("aria-labelledby") ?? ""
        );
        return aria === id;
      });
      if (found) {
        const wrapper = found.querySelector(".accordeonItemWrapper");
        const action = wrapper?.querySelector(".action[data-idville]");
        const idCity = Number(action?.getAttribute("data-idville"));
        const population = Number(
          found
            .querySelector<HTMLElement>(".menuVillageRessourcesElement")
            ?.innerText.trim()
        );
        _cities.push({ name: cityName, population, id: idCity });
      }
    });

    console.log("collected cities");
    this.cities = _cities;
  };

  sortBy(key?: keyof City, desc?: boolean) {
    return [...this.cities].sort((a, b) => {
      const aValue = a[key ?? "name"];
      const bValue = b[key ?? "name"];
      if (typeof aValue === "undefined" && typeof bValue === "undefined")
        return 0;
      else if (typeof aValue !== "undefined" && typeof bValue === "undefined")
        return -1;
      else if (typeof aValue === "undefined" && typeof bValue !== "undefined")
        return 1;
      else if (aValue! < bValue!) return desc ? 1 : -1;
      else if (aValue! > bValue!) return desc ? -1 : 1;
      else if (a.name < b.name) return -1;
      else if (a.name > b.name) return 0;
      return 0;
    });
  }
}

const moh_cities = new Cities();

interface Window {
  moh_cities: Cities;
}

window.moh_cities = moh_cities;
