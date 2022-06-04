type Category = { name: string };

type PathFromRoot = Category[];

type Address = { city_name: string };

type Shipping = { free_shipping: boolean };

type Prices = { amount: number; currency: string };

type FilterValue = { path_from_root?: PathFromRoot };

type Filter = { values: FilterValue[] };

type Picture = {
  size: string;
  secure_url: string;
};

type Item = {
  id: string;
  price: number;
  title: string;
  prices: Prices;
  address: Address;
  condition: string;
  thumbnail: string;
  shipping: Shipping;
  currency_id: string;
};

export type ItemDescriptionResponse = { plain_text: string };

export type CategoryResponse = { path_from_root: PathFromRoot };

export type ItemsResponse = {
  results: Item[];
  filters: Filter[];
};

export type ItemDetailsResponse = {
  id: string;
  price: number;
  title: string;
  condition: string;
  shipping: Shipping;
  category_id: string;
  currency_id: string;
  pictures: Picture[];
  sold_quantity: number;
};
