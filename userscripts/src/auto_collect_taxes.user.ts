// ==UserScript==
// @name         March of History - auto collect taxes
// @namespace    https://github.com/avalenti89/march-of-history/
// @version      0.1.3
// @description  Auto collect taxes from windmill and court when enter in a signoury
// @author       avalenti89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/avalenti89/March_of_History_-_utilities.js
// ==/UserScript==
/* jshint esversion: 6 */

console.log("Auto collect taxes", "script loaded");

const moh_auto_collect_taxes = (() => {
  const collectWindMillTaxes = () => {
    const { moulin, batiments } = window.ville;
    if (batiments?.[moulin.ID]?.recoltable) {
      console.log("Collecting Windmill");
      moulin.recupererTaxes();
      batiments[moulin.ID].recoltable = false;
    }
  };

  const collectCourtTaxes = () => {
    const { tribunal, batiments } = window.ville;
    if (batiments[tribunal.ID]?.recoltable) {
      console.log("Collecting Court");
      tribunal.recupererTaxes();
      batiments[tribunal.ID].recoltable = false;
    }
  };

  MoH_Utils.setListenerVille((ville) => {
    if (ville.moulin?.ID) {
      collectWindMillTaxes();
    }
    if (ville.tribunal?.ID) {
      collectCourtTaxes();
    }
  });

  return {
    collectWindMillTaxes,
  };
})();

interface Window {
  moh_auto_collect_taxes: typeof moh_auto_collect_taxes;
}
window.moh_auto_collect_taxes = moh_auto_collect_taxes;
