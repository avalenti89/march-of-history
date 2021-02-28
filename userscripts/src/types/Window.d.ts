interface Window {
  $: any;
  bridge: {
    sendArray: (obj: object) => void;
  };
  ville: {
    isProxy: Symbol;
    batiments: {
      [key: number]: {
        ID: number;
        recoltable?: boolean;
      };
    };
    moulin: { ID: number; recupererTaxes: () => void };
    tribunal: { ID: number; recupererTaxes: () => void };
    infos: {
      ID: number;
      stocks: {
        bois: number;
      };
      stocksMax: {
        bois: number;
      };
      cours: {
        bois: number;
      };
    };
  };
}
