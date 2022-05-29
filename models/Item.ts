export type Item = {
    id: string;
    title: string;
    price: {
      currency: string;
      amount: number;
      decimals: number;
    };
    thumbnail: string;
    condition: string;
    shipping: {
      free_shipping: boolean;
    };
};
