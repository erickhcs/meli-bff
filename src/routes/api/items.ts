import express from "express";
import ItemsController from "../../controllers";

const router = express.Router();

router.get("/items", ItemsController.getItems);
router.get("/items/:id", ItemsController.getItemDetails);

export default router;
