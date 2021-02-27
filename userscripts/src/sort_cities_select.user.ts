// ==UserScript==
// @name         March of History - sort cities select
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.8
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

console.log("Sort Cities select", "script loaded");

const moh_sort_cities_select = (() => {
  let sortKey: keyof City = "population";
  let sortDesc: boolean = true;

  let sortedCities: Array<City> = [];

  const getSortedCities = () => {
    const list = document.querySelector("#villeListeVilles ul");
    const elements = list?.querySelectorAll<HTMLElement>("li");
    if (!elements?.length) return;

    console.log(`sorting by ${sortKey}${sortDesc ? "desc" : ""}`);
    sortedCities = moh_cities.cities.length
      ? moh_cities.sortBy(sortKey, sortDesc)
      : [...elements]
          .reduce<City[]>((prev, el) => {
            const action = el.querySelector<HTMLElement>(".action");
            const id = action?.getAttribute("data-idville");
            const name = MoH_Utils.cleanText(
              el.querySelector<HTMLElement>(".deroulantVillesNomProvince")
                ?.innerText ?? ""
            ).replace("seignory of ", "");
            if (!id || !name) return prev;
            const city: City = {
              id: Number(id),
              name,
            };
            return [...prev, city];
          }, [])
          .sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortSelect = () => {
    const list = document.querySelector("#villeListeVilles ul");
    const elements = list?.querySelectorAll<HTMLElement>("li");
    if (!elements?.length) return;

    console.log(`sorting by ${sortKey}${sortDesc ? "desc" : ""}`);
    let sortedNames: string[] = sortedCities.map((city) => city.name);

    const sorted = [...elements].sort((a, b) => {
      const textA = MoH_Utils.cleanText(
        a.querySelector<HTMLElement>(".deroulantVillesNomProvince")
          ?.innerText ?? ""
      ).replace("seignory of ", "");
      const textB = MoH_Utils.cleanText(
        b.querySelector<HTMLElement>(".deroulantVillesNomProvince")
          ?.innerText ?? ""
      ).replace("seignory of ", "");

      const priorA = sortedNames.findIndex((val) => textA.includes(val));
      const priorB = sortedNames.findIndex((val) => textB.includes(val));

      return priorA - priorB;
    });

    elements.forEach((el) => el.remove());
    sorted.forEach((el) => {
      const action = el.querySelector<HTMLElement>(".action");
      if (!action) return;
      el.title = `${MoH_Utils.cleanText(
        action.innerText
      )} - ${action.getAttribute("data-idville")}`;
      list?.append(el);
    });
  };

  const setArrows = () => {
    const currentCityElement = document.querySelector(
      "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince"
    );
    if (!currentCityElement) return;
    const currentCityName = MoH_Utils.cleanText(
      currentCityElement.innerHTML
    ).replace("seignory of ", "");
    const currentCity_index = sortedCities.findIndex((city) => {
      return city.name === currentCityName;
    });

    const prev_city =
      sortedCities[currentCity_index - 1] ??
      sortedCities[sortedCities.length - 1];

    const next_city = sortedCities[currentCity_index + 1] ?? sortedCities[0];

    if (next_city.id && prev_city.id) {
      const prev_city_button = document.querySelector(
        "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelLeft.action"
      );
      const next_city_button = document.querySelector(
        "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelRight.action"
      );
      if (!prev_city_button || !next_city_button) return;

      prev_city_button.setAttribute("data-idville", prev_city.id.toString());
      prev_city_button.setAttribute("title", prev_city.name);
      next_city_button.setAttribute("data-idville", next_city.id.toString());
      next_city_button.setAttribute("title", next_city.name);
    }
  };

  const run = (...[_sortKey, _desc]: Parameters<Cities["sortBy"]>) => {
    sortKey = _sortKey ?? sortKey;
    sortDesc = _desc ?? sortDesc;
    getSortedCities();
    sortSelect();
    setArrows();
  };

  MoH_Utils.checkPageChange("#ecranVille", () => {
    run();
  });

  return {
    sortKey,
    sortDesc,
    run,
    sortSelect,
    setArrows,
  };
})();

interface Window {
  moh_sort_cities_select: typeof moh_sort_cities_select;
}
window.moh_sort_cities_select = moh_sort_cities_select;
