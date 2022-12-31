import express from "express";
import companyRoutes from "../routers/market/company/index.js"
import stockRoutes from "../routers/market/stock/index.js"

const router = express.Router();

export default (mongoDB) => {
  router.get("/", (req, res) => res.send(`Welcome to stock market API`));
  router.use("/market/company", companyRoutes(mongoDB));
  router.use("/market/stock", stockRoutes(mongoDB))
  return router;
};