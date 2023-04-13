import express from "express";
import { JsonDB, Config } from 'node-json-db';
import { checkOrder, cost, getApparel, updateMultipleQualityAndSize, updateQualityAndSize } from "../controller/apparel.controller";
const router = express.Router();

router.get("/", getApparel);


router.put("/:code/:size", updateQualityAndSize)


router.post("/update-multiple", updateMultipleQualityAndSize);


router.post("/check-order", checkOrder);


router.post("/lowest-cost", cost)

export { router }