interface Ville {
  isProxy: Symbol;
  batiments: {
    [key: number]: {
      type: number;
      ID: number;
      recoltable?: boolean;
      productionAnnuelle?: number;
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
}

interface Listener<T> {
  _listeners: Array<(data: T) => void>;
  _on: (callback: (data: T) => void) => void;
  _notify: (data: T) => void;
}

interface Window {
  $: any;
  bridge: {
    sendArray: (obj: object) => void;
  };
  ville: Ville & Listener<Ville>;
}
