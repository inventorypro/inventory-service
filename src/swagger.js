const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'A description of your API',
    },
    components: {
      schemas: {
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated ID of the category',
            },
            name: {
              type: 'string',
              description: 'The name of the category',
            },
            description: {
              type: 'string',
              description: 'The description of the category',
            },
          },
          example: {
            _id: '60d0fe4f5311236168a109ca',
            name: 'Electronics',
            description: 'Devices and gadgets',
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
