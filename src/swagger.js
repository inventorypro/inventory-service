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
        InventoryItem: {
          type: 'object',
          required: [
            'itemId',
            'name',
            'categoryId',
            'quantity',
            'price',
            'supplierId',
            'reorderLevel',
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated ID of the inventory item',
            },
            itemId: {
              type: 'string',
              description: 'The unique item ID',
            },
            name: {
              type: 'string',
              description: 'The name of the inventory item',
            },
            description: {
              type: 'string',
              description: 'The description of the inventory item',
            },
            categoryId: {
              type: 'string',
              description: 'The ID of the category',
            },
            quantity: {
              type: 'number',
              description: 'The quantity of the inventory item',
            },
            price: {
              type: 'number',
              description: 'The price of the inventory item',
            },
            supplierId: {
              type: 'string',
              description: 'The ID of the supplier',
            },
            reorderLevel: {
              type: 'number',
              description: 'The reorder level of the inventory item',
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
              description: 'The last updated date of the inventory item',
            },
            status: {
              type: 'string',
              description: 'The status of the inventory item',
            },
          },
          example: {
            _id: '60d0fe4f5311236168a109cb',
            itemId: '123456',
            name: 'Laptop',
            description: 'A high-performance laptop',
            categoryId: '60d0fe4f5311236168a109ca',
            quantity: 10,
            price: 1000,
            supplierId: '60d0fe4f5311236168a109cc',
            reorderLevel: 5,
            lastUpdated: '2023-10-01T00:00:00.000Z',
            status: 'active',
          },
        },
        StockLevel: {
          type: 'object',
          required: ['itemId', 'stockLevel'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated ID of the stock level',
            },
            itemId: {
              type: 'string',
              description: 'The ID of the inventory item',
            },
            stockLevel: {
              type: 'number',
              description: 'The stock level of the inventory item',
            },
          },
          example: {
            _id: '60d0fe4f5311236168a109cd',
            itemId: '60d0fe4f5311236168a109cb',
            stockLevel: 50,
          },
        },
        Supplier: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated ID of the supplier',
            },
            name: {
              type: 'string',
              description: 'The name of the supplier',
            },
            contactInfo: {
              type: 'string',
              description: 'The contact information of the supplier',
            },
            address: {
              type: 'string',
              description: 'The address of the supplier',
            },
          },
          example: {
            _id: '60d0fe4f5311236168a109cc',
            name: 'Tech Supplies Inc.',
            contactInfo: 'contact@techsupplies.com',
            address: '123 Tech Street, Silicon Valley, CA',
          },
        },
        FileUpload: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
              description: 'The file to upload',
            },
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
