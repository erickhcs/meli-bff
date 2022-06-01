import express from "express";
import ItemsRoutes from "./items";

const router = express.Router();

router.use("/api", ItemsRoutes);

export default router;
