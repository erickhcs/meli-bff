import express from "express";
import APIRoutes from "./api";

const router = express.Router();
router.use("/", APIRoutes);

export default router;
