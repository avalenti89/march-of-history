// ==UserScript==
// @name         Sort cities select
// @namespace    March of history
// @version      0.1
// @description  Sort the cities list on select, based on population or priority/alphabetical
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license     MIT
// @run-at      document-start
// ==/UserScript==
console.log("script run");

const cleanText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const checkMutation = (target, id, callback) => {
  var targetNode = document.querySelector(target);
  var config = { attributes: true, childList: true };

  var observer = new MutationObserver((mutationsList, observer) => {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        const element = targetNode.querySelector(id);
        if (element) {
          console.log(`Found ${id}`);
          callback();
        }
      }
    }
  });
  observer.observe(targetNode, config);

  return observer;
};

const instance = (function () {
  let priority = [];

  let populations = [];
  let sortType = "populations";

  const startScript = () => {
    const checkForReady = checkMutation("body", "#contenu", () => {
      checkMutation("#contenu", "#ecranCarte", () => {
        collectPopulation();
      });
      checkMutation("#contenu", "#ecranVille", () => {
        sortCities(sortType);
        setArrows();
      });
      checkForReady.disconnect();
    });
  };

  const collectPopulation = () => {
    populations = [];
    console.log("collection populations");
    const list = document.querySelector(".tabsCarte #tabs-1 .accordion");
    const citiesElement = list.querySelectorAll("h3");
    const dataElements = list.querySelectorAll(".accordeonItem");
    citiesElement.forEach((el) => {
      const id = cleanText(el.id);
      const cityName = cleanText(
        el.querySelector("a.accordeonTitre").innerText
      ).replace("seignory of ", "");
      const found = Array.from(dataElements).find((el) => {
        const aria = cleanText(el.getAttribute("aria-labelledby"));
        return aria === id;
      });
      if (found) {
        const wrapper = found.querySelector(".accordeonItemWrapper");
        const action = wrapper.querySelector(".action[data-idville]");
        const idCity = action.getAttribute("data-idville");
        const population = Number(
          found.querySelector(".menuVillageRessourcesElement").innerText.trim()
        );
        populations.push({ cityName, population, idCity });
      }
    });
    populations = [...populations].sort((a, b) => {
      if (a.population < b.population) return 1;
      if (a.population > b.population) return -1;
      return 0;
    });
    console.log("collected populations");
  };

  const sortCities = (type) => {
    console.log("started");
    const list = document.querySelector("#villeListeVilles ul");
    const elements = list.querySelectorAll("li");
    console.log(`sorting by ${type}`);
    const sorted = [...elements].sort((a, b) => {
      const textA = cleanText(
        a.querySelector(".deroulantVillesNomProvince").innerText
      ).replace("seignory of ", "");
      const textB = cleanText(
        b.querySelector(".deroulantVillesNomProvince").innerText
      ).replace("seignory of ", "");
      if (type === "priority") {
        const found = priority.reduce((prev, curr) => {
          if (typeof prev !== "undefined") return prev;
          if (textA.includes(curr)) return -1;
          if (textB.includes(curr)) return 1;
          return prev;
        }, undefined);
        if (typeof found !== "undefined") {
          console.log(type, "found");
          return found;
        }
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        if (textA === textB) return 0;
      } else if (type === "populations" && populations.length) {
        const found = populations.reduce((prev, curr) => {
          if (typeof prev !== "undefined") return prev;
          if (textA.includes(curr.cityName)) return -1;
          if (textB.includes(curr.cityName)) return 1;
          return prev;
        }, undefined);
        return found ? found : 0;
      } else {
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        if (textA === textB) return 0;
      }
    });
    elements.forEach((el) => el.remove());
    sorted.forEach((el) => {
      const action = el.querySelector(".action");
      el.title = `${cleanText(action.innerText)} - ${action.getAttribute(
        "data-idville"
      )}`;
      list.append(el);
    });
  };

  const setArrows = () => {
    const currentCityElement = document.querySelector(
      "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince"
    );
    const currentCityName = cleanText(currentCityElement.innerHTML).replace(
      "seignory of ",
      ""
    );
    const currentCity_index = populations.findIndex((pop) => {
      return pop.cityName === currentCityName;
    });

    const prev_city =
      populations[currentCity_index - 1] ?? populations[populations.length - 1];
    const prev_id = prev_city.idCity;

    const next_city = populations[currentCity_index + 1] ?? populations[0];
    const next_id = next_city.idCity;

    if (next_id && prev_id) {
      const left = document.querySelector(
        "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelLeft.action"
      );
      left.setAttribute("data-idville", prev_id);
      left.setAttribute("title", prev_city.cityName);
      const right = document.querySelector(
        "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelRight.action"
      );
      right.setAttribute("data-idville", next_id);
      right.setAttribute("title", next_city.cityName);
    }
  };

  return {
    priority,
    sortType,
    startScript,
    collectPopulation,
    sortCities,
    setArrows,
  };
})();

window.instance = instance;

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM loaded");
  instance.startScript();
});
