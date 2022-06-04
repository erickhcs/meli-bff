import { NextFunction, Request, Response } from "express";
import { ENV, HTTPClient } from "../config";
import {
  CategoryResponse,
  getItemDetailsResponse,
  getItemsResponse,
  ItemDescriptionResponse,
  ItemDetailsResponse,
  ItemsResponse,
} from "../models";

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

      const { data } = await ItemsController.httpClient.get<ItemsResponse>(
        `/sites/MLA/search?q=${query}`
      );

      const response = getItemsResponse(data);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getItemDetails(req: Request, res: Response, next: NextFunction) {
    try {
      ItemsController.initHTTPClient();

      const { id: paramId } = req.params;

      const { data: dataItemDetails } =
        await ItemsController.httpClient.get<ItemDetailsResponse>(
          `/items/${paramId}`
        );

      const { data: dataCategory } =
        await ItemsController.httpClient.get<CategoryResponse>(
          `/categories/${dataItemDetails.category_id}`
        );

      const { data: dataItemDescription } =
        await ItemsController.httpClient.get<ItemDescriptionResponse>(
          `/items/${dataItemDetails.id}/description`
        );

      const response = getItemDetailsResponse(
        dataItemDetails,
        dataCategory,
        dataItemDescription
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default ItemsController;
