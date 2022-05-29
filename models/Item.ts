export type Item = {
    id: string;
    title: string;
    currency_id: string;
    price: number;
    prices: {
      currency: string;
      amount: number;
    };
    thumbnail: string;
    condition: string;
    shipping: {
      free_shipping: boolean;
    };
    address: {
      city_name: string;
    }
};
