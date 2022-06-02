import { NextFunction, Request, Response } from "express";
import { ENV, HTTPClient } from "../config";
import { Item, Picture } from "../models";

const author = {
  name: ENV.AUTHOR_NAME,
  lastname: ENV.AUTHOR_LASTNAME,
};

class ItemsController {
  static httpClient: HTTPClient;

  static initHTTPClient() {
    if (!this.httpClient) {
      this.httpClient = new HTTPClient(ENV.MELI_API_HOST);
    }
  }

  static async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      ItemsController.initHTTPClient();

      const query = req.query.q;

      const { data } = await ItemsController.httpClient.get(
        `/sites/MLA/search?q=${query}`
      );

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

  static async getItemDetails(req: Request, res: Response, next: NextFunction) {
    try {
      ItemsController.initHTTPClient();

      const { id } = req.params;

      const { data: itemResponse } = await ItemsController.httpClient.get(
        `/items/${id}`
      );
      const { data: itemCategoryResponse } =
        await ItemsController.httpClient.get(
          `/categories/${itemResponse.category_id}`
        );
      const { data: itemDescriptionResponse } =
        await ItemsController.httpClient.get(`/items/${id}/description`);

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
}

export default ItemsController;
