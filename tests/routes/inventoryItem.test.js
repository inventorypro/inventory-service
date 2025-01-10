import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app, connectToDatabase } from '../../src/app';
import InventoryItem from '../../src/models/inventoryItem';
import Category from '../../src/models/category';
import Supplier from '../../src/models/supplier';

let server;
let mongoServer;

// Sample mock data for InventoryItem, Category, and Supplier models
const mockCategory = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Category',
  description: 'This is a test category',
};

const mockSupplier = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Supplier',
  contactInfo: 'test@supplier.com',
  address: '123 Supplier St.',
};

const mockInventoryItem = {
  _id: new mongoose.Types.ObjectId(),
  itemId: '123456',
  name: 'Test Item',
  description: 'This is a test item',
  categoryId: mockCategory._id,
  quantity: 10,
  price: 100,
  supplierId: mockSupplier._id,
  reorderLevel: 5,
  status: 'In Stock',
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect(); // Ensure any previous connections are closed
  await connectToDatabase(mongoUri); // Connect to the in-memory MongoDB

  server = app.listen(4000, () => {
    console.log('Test server running on port 4000');
  });
}, 30000); // Increase timeout to 30 seconds

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (server) {
    server.close();
  }
}, 30000); // Increase timeout to 30 seconds

beforeEach(async () => {
  // Insert mock category and supplier into the database
  await Category.create(mockCategory);
  await Supplier.create(mockSupplier);
  // Insert mock inventory item into the database
  await InventoryItem.create(mockInventoryItem);
}, 30000); // Increase timeout to 30 seconds

afterEach(async () => {
  // Remove mock inventory item, category, and supplier from the database
  await InventoryItem.deleteMany({});
  await Category.deleteMany({});
  await Supplier.deleteMany({});
}, 30000); // Increase timeout to 30 seconds

describe('Inventory Routes', () => {
  it('GET /inventory - should return all inventory items', async () => {
    const response = await request(server).get('/inventory');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /inventory/:id - should return an inventory item by ID', async () => {
    const response = await request(server).get(
      `/inventory/${mockInventoryItem._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockInventoryItem.name);
    expect(response.body.description).toBe(mockInventoryItem.description);
  });

  it('POST /inventory - should create a new inventory item', async () => {
    const newItem = {
      itemId: '654321',
      name: 'New Test Item',
      description: 'This is a new test item',
      categoryId: mockCategory._id,
      quantity: 5,
      price: 200,
      supplierId: mockSupplier._id,
      reorderLevel: 3,
      status: 'In Stock',
    };
    const response = await request(server).post('/inventory').send(newItem);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.description).toBe(newItem.description);
  });

  it('PUT /inventory/:id - should update an existing inventory item', async () => {
    const updatedItem = {
      name: 'Updated Test Item',
      description: 'This is an updated test item',
    };
    const response = await request(server)
      .put(`/inventory/${mockInventoryItem._id}`)
      .send(updatedItem);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedItem.name);
    expect(response.body.description).toBe(updatedItem.description);
  });

  it('DELETE /inventory/:id - should delete an inventory item by ID', async () => {
    const response = await request(server).delete(
      `/inventory/${mockInventoryItem._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Deleted Inventory Item');
  });
});
