import { Router } from "express";
import _ from "lodash";

const router = Router();

export default (mongoDB) => {
  router.get("/getAll", async (req, res) => {
    let database;
    database = req.db;
    await database
      .collection("company")
      .find({})
      .project({ _id: 0 })
      .toArray((error, results) => {
        if (error) {
          response.status(500).send(error);
        }
        _.map(results, (result) => {
          let latestStockDetail = [];
          if (result.stockDetails.length > 0) {
            latestStockDetail =
              result.stockDetails[result.stockDetails.length - 1];
          }
          result.stockDetails = latestStockDetail;
        });
        res.send(results);
      });
  });
  router.get("/info", async (req, res) => {
    let database;
    database = req.db;
    let companyCode =
      req.query && req.query.companyCode ? parseInt(req.query.companyCode) : 0;
    if (companyCode !== 0) {
      await database
        .collection("company")
        .find({ code: companyCode })
        .toArray((error, results) => {
          if (error) {
            response.status(500).send(error);
          } else if (results.length > 0) {
            _.map(results, (result) => {
              let latestStockDetail = [];
              if (result.stockDetails.length > 0) {
                latestStockDetail =
                  result.stockDetails;
              }
              result.stockDetails = latestStockDetail;
            });
            res.send(results);
          } else {
            res.send("No Company Details Found");
          }
        });
    } else {
      res.send("Invalid Company Code");
    }
  });
  router.post("/register", async (req, res) => {
    let database;
    database = req.db;
    if (
      req.body &&
      req.body.companyCode &&
      req.body.companyName &&
      req.body.turnOver &&
      req.body.website &&
      req.body.stockExchange
    ) {
      let isExistCode = await database
        .collection("company")
        .find({ code: req.body.companyCode })
        .toArray();
      if (isExistCode.length > 0)
        return res.status(500).send("Duplicate Company Code");
      if (req.body.turnOver < 10)
        return res
          .status(500)
          .send("Company turnover must be greater than 10Cr");
      let maxId = await getCompanyMaxId(database)||1;
      let newCompanyObject = {
        id: maxId,
        code: req.body.companyCode,
        name: req.body.companyName,
        ceo: req.body.ceo,
        turnOver: `${req.body.turnOver}Cr`,
        website: req.body.website,
        stockExchange: req.body.stockExchange,
        stockDetails: [],
        addedBy: "System",
        addedOn: new Date(),
        updatedBy: "System",
        updatedOn: new Date(),
        active: "Y",
      };
      await database
        .collection("company")
        .insertOne(newCompanyObject)
        .then(() => {
          res.send({ statusCode: "201" });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    } else {
      return res.status(500).send("Missing mandatory input fields");
    }
  });
  router.delete("/delete", async (req, res) => {
    let database;
    database = req.db;
    let companyCode = parseInt(req.query.companyCode);
    await database
      .collection("company")
      .remove({ code: companyCode })
      .then(() => {
        res.send({ statusCode: "200", response: "Deleted Successfully" });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
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
    if( _.head(idResponse)){
      return _.head(idResponse).id + 1;
    }
    else return 1;
  
}
