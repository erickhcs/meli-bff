import axios from 'axios';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Item } from './models';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const axiosInstance = axios.create({
  baseURL: "https://api.mercadolibre.com/",
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

app.get('/api/items', async (req: Request, res: Response) => {
  const query = req.query.q

  const { data } = await axiosInstance.get(`/sites/MLA/search?q=${query}`)

  const limitedResults: Item[] = data.results.slice(0, 4);
  const items = limitedResults.map(item=> {
    return {
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: item.price,
      },
      picture: item.thumbnail,
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      address: {
        city_name: item.address.city_name,
      },
    }
  })

  const categories = data.filters[0]?.values[0]?.path_from_root?.map(({ name }: { name:string }) => name) || [];
  const response = {
    autor: {
      name: "Erick",
      lastname: "Silva",
    },
    categories,
    items,
  }

  res.json(response);
});
