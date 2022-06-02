import { NextFunction, Request, Response } from "express";
import { ENV, HTTPClient } from "../config";
import {
  CategoryResponse,
  ItemDescriptionResponse,
  ItemDetailsResponse,
  ItemsResponse,
} from "../models";

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

      const query = req.query.q as string;

      const {
        data: { results, filters },
      } = await ItemsController.httpClient.get<ItemsResponse>(
        `/sites/MLA/search?q=${query}`
      );

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

      res.json({
        items,
        author,
        categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItemDetails(req: Request, res: Response, next: NextFunction) {
    try {
      ItemsController.initHTTPClient();

      const { id: paramId } = req.params;

      const {
        data: {
          id,
          price,
          title,
          pictures,
          condition,
          category_id: categoryId,
          currency_id: currencyId,
          sold_quantity: soldQuantity,
          shipping: { free_shipping: freeShipping },
        },
      } = await ItemsController.httpClient.get<ItemDetailsResponse>(
        `/items/${paramId}`
      );

      const {
        data: { path_from_root: pathFromRoot },
      } = await ItemsController.httpClient.get<CategoryResponse>(
        `/categories/${categoryId}`
      );

      const {
        data: { plain_text: description },
      } = await ItemsController.httpClient.get<ItemDescriptionResponse>(
        `/items/${id}/description`
      );

      const maxSizePicture = pictures.sort((a, b) => {
        const aWidth = Number(a.size.split("x")[0]);
        const bWidth = Number(b.size.split("x")[0]);

        return aWidth - bWidth;
      })[0].secure_url;

      const categories = pathFromRoot.map(({ name }) => name);

      res.json({
        author,
        categories,
        item: {
          id,
          title,
          condition,
          description,
          soldQuantity,
          picture: maxSizePicture,
          free_shipping: freeShipping,
          price: {
            amount: price,
            currency: currencyId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ItemsController;
