interface Menu {
  name: string;
  price: string;
  simbolMoney: string;
  typeOfMoney: string;
}

interface Menus {
  [key: string]: Menu;
}

interface FAQ {
  [key: string]: string;
}

export interface PromptData {
  promptIA: string;
  faq: FAQ;
  menus: Menus;
  menuDay: { [key: string]: string };
}
