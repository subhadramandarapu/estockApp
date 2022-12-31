const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Market API",
      version: "1.0.0",
      description: "API for Stock Market",
    },
    servers: [{ url: "http://localhost:4000" }],
    tags: [
      {
        name: "Company",
        description: "Company Routes",
      },
      {
        name: "Stock",
        description: "Stock Routes",
      },
    ],
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    paths: {
      "/v1/market/company/getAll": {
        get: {
          tags: ["Company"],
          description: "List All Company",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    example: {
                      count: 0,
                      company: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/market/company/info": {
        get: {
          tags: ["Company"],
          description: "Get Single Company Info",
          parameters: [
            {
              name: "companyCode",
              in: "query",
              type: "integer",
            },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    example: {
                      count: 0,
                      company: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/market/company/register": {
        post: {
          tags: ["Company"],
          description: "Register New Company",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/definitions/Company",
                },
              },
            },
            required: true,
          },

          produces: ["application/json"],
          responses: {
            201: {
              description: "Registered Successfully",
            },
          },
        },
      },
      "/v1/market/company/delete": {
        delete: {
          tags: ["Company"],
          description: "Delete Company",
          parameters: [
            {
              name: "companyCode",
              in: "query",
              type: "integer",
            },
          ],
          responses: {
            200: {
              description: "Deleted Successfully",
            },
          },
        },
      },
      "/v1/market/stock/add": {
        post: {
          tags: ["Stock"],
          description: "Add Stock to Company",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/definitions/Stock",
                },
              },
            },
            required: true,
          },

          produces: ["application/json"],
          responses: {
            201: {
              description: "Added Successfully",
            },
          },
        },
      },
      "/v1/market/stock/get": {
        get: {
          tags: ["Stock"],
          description: "Get Company Stock Details",
          parameters: [
            {
              name: "companyCode",
              in: "query",
              type: "integer",
            },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    example: {
                      count: 0,
                      stockDetails: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    definitions: {
      Company: {
        required: [],
        properties: {
          companyCode: {
            type: "integer",
            uniqueItems: "true",
          },
          companyName: {
            type: "string",
            uniqueItems: "true",
          },
          ceo: {
            type: "string",
            uniqueItems: "true",
          },
          turnOver: {
            type: "integer",
            uniqueItems: "true",
          },
          website: {
            type: "string",
            uniqueItems: "true",
          },
          stockExchange: {
            type: "string",
            uniqueItems: "true",
          },
        },
      },
      Stock: {
        required: [],
        properties: {
          companyCode: {
            type: "integer",
            uniqueItems: "true",
          },
          stockPrice: {
            type: "integer",
            uniqueItems: "true",
          },
        },
      },
    },
  },
  apis: ["/index.js"],
};

export default swaggerOptions;
