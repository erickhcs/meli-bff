import axios from 'axios';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Item } from './models';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const axiosInstance = axios.create({
  baseURL: process.env.MELI_API_HOST,
});

const author =  {
  name: process.env.AUTHOR_NAME,
  lastname: process.env.AUTHOR_LASTNAME,
};

app.get('/api/items', async (req: Request, res: Response) => {
  const query = req.query.q

  const { data } = await axiosInstance.get(`/sites/MLA/search?q=${query}`)

  const limitedResults: Item[] = data.results.slice(0, 4);
  const items = limitedResults.map(item=> {
    const splittedAmount = item.price.toString().split('.')

    const amount = Number(splittedAmount[0]);
    const decimals = Number(splittedAmount[1] || 0);

    return {
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount,
        decimals,
      },
      picture: item.thumbnail,
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      address: {
        city_name: item.address.city_name,
      },
    }
  })

  const categories: String[] = data.filters[0]?.values[0]?.path_from_root?.map(({ name }: { name:string }) => name) || [];
  const response = {
    author,
    categories,
    items,
  }

  res.json(response);
});

app.get('/api/items/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const { data: itemResponse } = await axiosInstance.get(`/items/${id}`)
  const { data: itemCategoryResponse } = await axiosInstance.get(`/categories/${itemResponse.category_id}`)
  const { data: itemDescriptionResponse } = await axiosInstance.get(`/items/${id}/description`)
 
  const splittedAmount =  itemResponse.price.toString().split('.')

  const amount = Number(splittedAmount[0]);
  const decimals = Number(splittedAmount[1] || 0);

  const response = {
    author,
    categories: itemCategoryResponse.path_from_root.map(({ name }: { name:string }) => name),
    item: {
      id: itemResponse.id,
      title: itemResponse.title,
      price: {
        currency: itemResponse.currency_id,
        amount,
        decimals,
      },
      picture: itemResponse.pictures[0].secure_url,
      condition: itemResponse.condition,
      free_shipping: itemResponse.shipping.free_shipping,
      sold_quantity: itemResponse.sold_quantity,
      description: itemDescriptionResponse.plain_text,
    }
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
