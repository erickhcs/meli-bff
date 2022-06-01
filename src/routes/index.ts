import express from "express";
import API from "./api";

const router = express.Router();

router.use("/", API);

export default router;
