import author from "./author";

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

export const getItemsResponse = ({ results, filters }: ItemsResponse) => {
  const limitedResults = results.slice(0, 4);

  const items = limitedResults.map((item) => ({
    id: item.id,
    title: item.title,
    picture: item.thumbnail,
    condition: item.condition,
    free_shipping: item.shipping.free_shipping,
    address: {
      city_name: item.address.city_name,
    },
    price: {
      amount: item.price,
      currency: item.currency_id,
    },
  }));

  const categories =
    filters[0]?.values[0]?.path_from_root?.map(({ name }) => name) || [];

  return {
    items,
    author,
    categories,
  };
};

export const getItemDetailsResponse = (
  dataItemDetails: ItemDetailsResponse,
  dataCategory: CategoryResponse,
  dataDescription: ItemDescriptionResponse
) => {
  const {
    id,
    price,
    title,
    pictures,
    condition,
    currency_id: currencyId,
    sold_quantity: soldQuantity,
    shipping: { free_shipping: freeShipping },
  } = dataItemDetails;

  const { path_from_root: pathFromRoot } = dataCategory;

  const { plain_text: description } = dataDescription;

  const maxSizePicture = pictures.sort((a, b) => {
    const aWidth = Number(a.size.split("x")[0]);
    const bWidth = Number(b.size.split("x")[0]);

    return aWidth - bWidth;
  })[0].secure_url;

  const categories = pathFromRoot.map(({ name }) => name);

  return {
    author,
    categories,
    item: {
      id,
      title,
      condition,
      description,
      picture: maxSizePicture,
      free_shipping: freeShipping,
      sold_quantity: soldQuantity,
      price: {
        amount: price,
        currency: currencyId,
      },
    },
  };
};
