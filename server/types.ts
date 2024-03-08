export interface Data {
  ingredients: Ingredient[];
  alerts: Alert[];
  categories: Category[];
  recipes: Recipe[];
}

export interface Alert {
  id: number;
  name: string;
  linked_categories: number[];
  timespan: Timespan;
}

export interface Timespan {
  value: number;
  type: string;
  time: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: number;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiration: string;
}

export interface Recipe {
  id: string;
  name: string;
  saved_on: string;
}
