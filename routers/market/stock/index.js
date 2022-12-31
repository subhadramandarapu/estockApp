import { Router } from "express";
import _ from "lodash";

const router = Router();

export default (mongoDB) => {
  router.get("/get", async (req, res) => {
    let database;
    database = req.db;
    let companyCode =
      req.query && req.query.companyCode ? parseInt(req.query.companyCode) : 0;
    if (companyCode !== 0) {
      let stockDetails = await database
        .collection("company")
        .aggregate([
          {
            $match: {
              code: companyCode,
            },
          },
          {
            $unwind: {
              path: "$stockDetails",
            },
          },
          {
            $project: {
              stockDetails: 1,
            },
          },
        ])
        .toArray();

      let result = _.map(stockDetails, "stockDetails");

      res.send(result);
    } else {
      res.send("Invalid Company Code");
    }
  });
  router.post("/add", async (req, res) => {
    let database;
    database = req.db;

    if (req.body.stockPrice % 1 !== 0) {
      let stockObject = {
        stockPrice: req.body.stockPrice,
        addedOn: new Date(),
      };
      await database
        .collection("company")
        .update(
          { code: req.body.companyCode },
          { $push: { stockDetails: stockObject } }
        )
        .then(() => {
          res.send({ statusCode: "201" });
        })
        .catch((error) => {
          return res.status(500).send(error);
        });
    } else {
      return res.status(500).send("Stockprice must be fraction value");
    }
  });
  return router;
};

async function getCompanyMaxId(database) {
  let idResponse = await database
    .collection("company")
    .aggregate([
      {
        $group: {
          _id: null,
          id: {
            $max: "$id",
          },
        },
      },
    ])
    .toArray();
  return _.head(idResponse).id + 1;
}
