import axios from "axios";
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { Item, Picture } from "./models";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const axiosInstance = axios.create({
  baseURL: process.env.MELI_API_HOST,
});

const author = {
  name: process.env.AUTHOR_NAME,
  lastname: process.env.AUTHOR_LASTNAME,
};

app.get(
  "/api/items",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q;

      const { data } = await axiosInstance.get(`/sites/MLA/search?q=${query}`);

      const limitedResults: Item[] = data.results.slice(0, 4);
      const items = limitedResults.map((item) => {
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
        };
      });

      const categories: string[] =
        data.filters[0]?.values[0]?.path_from_root?.map(
          ({ name }: { name: string }) => name
        ) || [];
      const response = {
        author,
        categories,
        items,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/api/items/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const { data: itemResponse } = await axiosInstance.get(`/items/${id}`);
      const { data: itemCategoryResponse } = await axiosInstance.get(
        `/categories/${itemResponse.category_id}`
      );
      const { data: itemDescriptionResponse } = await axiosInstance.get(
        `/items/${id}/description`
      );

      const maxSizePicture = itemResponse.pictures.sort(
        (a: Picture, b: Picture) => {
          const aWidth = Number(a.size.split("x")[0]);
          const bWidth = Number(b.size.split("x")[0]);

          return aWidth - bWidth;
        }
      )[0].secure_url;

      const response = {
        author,
        categories: itemCategoryResponse.path_from_root.map(
          ({ name }: { name: string }) => name
        ),
        item: {
          id: itemResponse.id,
          title: itemResponse.title,
          price: {
            currency: itemResponse.currency_id,
            amount: itemResponse.price,
          },
          picture: maxSizePicture,
          condition: itemResponse.condition,
          free_shipping: itemResponse.shipping.free_shipping,
          sold_quantity: itemResponse.sold_quantity,
          description: itemDescriptionResponse.plain_text,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
