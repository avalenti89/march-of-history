// ==UserScript==
// @name         March of History - Sort cities select
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.4
// @description  Sort the cities list on select, based on population or priority/alphabetical
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-start
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// ==/UserScript==
/* jshint esversion: 6 */

console.log("script run");

const moh_sort_cities_select = (() => {
  const { cities, cleanText, checkChildMutation } = moh_utils;

  let priorityList: string[] = [];
  let sortType = "populations";

  const run = () => {
    sortSelect(sortType);
    setArrows();
  };

  checkChildMutation("body", "#ecranVille", () => {
    run();
  });

  const sortSelect = (type?: string) => {
    const list = document.querySelector("#villeListeVilles ul");
    if (!list) return;
    const elements = list.querySelectorAll<HTMLElement>("li");
    console.log(`sorting by ${type}`);
    let sortList: string[] = [];
    switch (type) {
      case "population":
        sortList = [...cities]
          .sort((a, b) => {
            if (a.population < b.population) return 1;
            if (a.population > b.population) return -1;
            return 0;
          })
          .map((city) => city.name);
        break;
      case "priority":
        sortList = priorityList;
    }

    const sorted = [...elements].sort((a, b) => {
      const textA = cleanText(
        a.querySelector<HTMLElement>(".deroulantVillesNomProvince").innerText
      ).replace("seignory of ", "");
      const textB = cleanText(
        b.querySelector<HTMLElement>(".deroulantVillesNomProvince").innerText
      ).replace("seignory of ", "");

      let found = 0;
      const priorA = priorityList.findIndex((val) => textA.includes(val));
      const priorB = priorityList.findIndex((val) => textB.includes(val));
      if (priorA > 0 && priorB > 0) {
        if (priorA < priorB) return -1;
        else if (priorA > priorB) return 1;
        else return 0;
      }
      if (priorA > 0 && priorB < 0) return -1;
      else if (priorB > 0 && priorA < 0) return 1;
      else if (textA < textB) return -1;
      else if (textA > textB) return 1;
      return 0;
    });
    elements.forEach((el) => el.remove());
    sorted.forEach((el) => {
      const action = el.querySelector<HTMLElement>(".action");
      el.title = `${moh_utils.cleanText(
        action.innerText
      )} - ${action.getAttribute("data-idville")}`;
      list.append(el);
    });
  };

  const setArrows = () => {
    if (!cities.length) return;
    const currentCityElement = document.querySelector(
      "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince"
    );
    if (!currentCityElement) return;
    const currentCityName = cleanText(currentCityElement.innerHTML).replace(
      "seignory of ",
      ""
    );
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

  return {
    priority: priorityList,
    sortType,
    run,
    sortSelect,
    setArrows,
  };
})();

interface Window {
  moh_sort_cities_select: typeof moh_sort_cities_select;
}
window.moh_sort_cities_select = moh_sort_cities_select;
