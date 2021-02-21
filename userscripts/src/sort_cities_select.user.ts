// ==UserScript==
// @name         March of History - sort cities select
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.6
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

console.log("script run");

const moh_sort_cities_select = (() => {
  let _sortKey: keyof City = "population";
  let _sortDesc: boolean = true;

  const sortSelect = (...[sortKey, desc]: Parameters<Cities["sortBy"]>) => {
    const list = document.querySelector("#villeListeVilles ul");
    const elements = list?.querySelectorAll<HTMLElement>("li");
    if (!elements?.length) return;

    console.log(`sorting by ${sortKey}${desc ? "desc" : ""}`);
    let sortList: string[] = moh_cities.cities.length
      ? moh_cities.sortBy(sortKey, desc).map((city) => city.name)
      : [...elements]
          .map((el) =>
            MoH_Utils.cleanText(
              el.querySelector<HTMLElement>(".deroulantVillesNomProvince")
                ?.innerText ?? ""
            ).replace("seignory of ", "")
          )
          .sort();

    const sorted = [...elements].sort((a, b) => {
      const textA = MoH_Utils.cleanText(
        a.querySelector<HTMLElement>(".deroulantVillesNomProvince")
          ?.innerText ?? ""
      ).replace("seignory of ", "");
      const textB = MoH_Utils.cleanText(
        b.querySelector<HTMLElement>(".deroulantVillesNomProvince")
          ?.innerText ?? ""
      ).replace("seignory of ", "");

      const priorA = sortList.findIndex((val) => textA.includes(val));
      const priorB = sortList.findIndex((val) => textB.includes(val));

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
    const { cities } = moh_cities;
    // if (!cities.length) return;
    const currentCityElement = document.querySelector(
      "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince"
    );
    if (!currentCityElement) return;
    const currentCityName = MoH_Utils.cleanText(
      currentCityElement.innerHTML
    ).replace("seignory of ", "");
    const currentCity_index = cities.findIndex((city) => {
      return city.name === currentCityName;
    });

    const prev_city =
      cities[currentCity_index - 1] ?? cities[cities.length - 1];
    const prev_id = prev_city.id;

    const next_city = cities[currentCity_index + 1] ?? cities[0];
    const next_id = next_city.id;

    if (next_id && prev_id) {
      const left = document.querySelector(
        "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelLeft.action"
      );
      if (!left) return;
      left.setAttribute("data-idville", prev_id.toString());
      left.setAttribute("title", prev_city.name);
      const right = document.querySelector(
        "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelRight.action"
      );
      if (!right) return;
      right.setAttribute("data-idville", next_id.toString());
      right.setAttribute("title", next_city.name);
    }
  };

  const run = (...[sortKey, desc]: Parameters<Cities["sortBy"]>) => {
    sortSelect(sortKey, desc);
    setArrows();
  };

  MoH_Utils.checkPageChange("#ecranVille", () => {
    run(_sortKey, _sortDesc);
  });

  return {
    _sortKey,
    _sortDesc,
    run,
    sortSelect,
    setArrows,
  };
})();

interface Window {
  moh_sort_cities_select: typeof moh_sort_cities_select;
}
window.moh_sort_cities_select = moh_sort_cities_select;
