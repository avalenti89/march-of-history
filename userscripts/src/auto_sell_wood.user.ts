// ==UserScript==
// @name         March of History - auto sell wood
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.1
// @description  Auto sell wood if the stock are full
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// ==/UserScript==
/* jshint esversion: 6 */

console.log("Auto sell wood", "script loaded");

const moh_auto_sell_woods = (() => {
  const sellWoods = () => {
    const unitPrice = window.ville.infos.cours.bois / 100;
    const quantity = 50;
    const ID = window.ville.infos.ID;

    window.bridge.sendArray({
      message: "actionMarche",
      action: "vend",
      ID: ID.toString(),
      ressource: "bois",
      quantite: quantity.toString(),
      prix: Math.round(unitPrice).toString(),
      IDDestinataire: ID.toString(),
    });
    window.ville.infos.stocks.bois = window.ville.infos.stocks.bois - 50;
  };

  MoH_Utils.setListenerVille((ville) => {
    const woodProd =
      Object.values(ville.batiments).find((b) => b.type === 6)
        ?.productionAnnuelle ?? 0;
    const { bois: wood } = ville.infos.stocks;
    const { bois: maxWood } = ville.infos.stocksMax;
    const { bois: woodPrice } = ville.infos.cours;
    if (
      woodPrice > 640 &&
      wood > maxWood - woodProd &&
      wood > 100 &&
      wood > maxWood / 2
    ) {
      console.log("Selling Wood", wood, woodPrice, woodProd);
      sellWoods();
    }
  });

  return {
    sellWoods,
  };
})();

interface Window {
  moh_auto_sell_woods: typeof moh_auto_sell_woods;
}
window.moh_auto_sell_woods = moh_auto_sell_woods;
