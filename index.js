import Express from "express";
import routes from "./routers/index.js";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import swaggerOptions from "./swagger.js";
import dbConfig from "./dbconfig.js";

var app = Express();

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;
let mongoDB;

app.use((req, res, next) => {
  req.db = mongoDB;
  next();
});

app.use(cors());
// * Routes * //
app.use("/v1", routes(mongoDB));

app.listen(port, () => {
  MongoClient.connect(
    dbConfig.connectionUrl,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      mongoDB = client.db(dbConfig.dbName);
    }
  );
  console.log("Listening on port " + port);
});

export default swaggerOptions;
