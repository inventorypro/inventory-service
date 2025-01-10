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
import Category from '../../src/models/category';

let server;
let mongoServer;

// Sample mock data for Category model
const mockCategory = {
  name: 'Test Category',
  description: 'This is a test category',
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect(); // Ensure any previous connections are closed
  await connectToDatabase(mongoUri); // Connect to the in-memory MongoDB

  server = app.listen(3000, () => {
    console.log('Test server running on port 3000');
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
  // Clear the database before each test
  await Category.deleteMany({});
  // Insert mock category into the database
  await Category.create(mockCategory);
}, 30000); // Increase timeout to 30 seconds

afterEach(async () => {
  // Clear the database after each test
  await Category.deleteMany({});
}, 30000); // Increase timeout to 30 seconds

describe('Category Routes', () => {
  it('GET /categories - should return all categories', async () => {
    const response = await request(server).get('/categories');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /categories/:categoryId - should return a category by ID', async () => {
    const category = await Category.findOne({ name: mockCategory.name });
    const response = await request(server).get(`/categories/${category._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockCategory.name);
    expect(response.body.description).toBe(mockCategory.description);
  });

  it('POST /categories - should create a new category', async () => {
    const newCategory = {
      name: 'New Category',
      description: 'This is a new category',
    };
    const response = await request(server)
      .post('/categories')
      .send(newCategory);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newCategory.name);
    expect(response.body.description).toBe(newCategory.description);
  });

  it('PUT /categories/:categoryId - should update an existing category', async () => {
    const category = await Category.findOne({ name: mockCategory.name });
    const updatedCategory = {
      name: 'Updated Category',
      description: 'This is an updated category',
    };
    const response = await request(server)
      .put(`/categories/${category._id}`)
      .send(updatedCategory);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedCategory.name);
    expect(response.body.description).toBe(updatedCategory.description);
  });

  it('DELETE /categories/:categoryId - should delete a category by ID', async () => {
    const category = await Category.findOne({ name: mockCategory.name });
    const response = await request(server).delete(
      `/categories/${category._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Deleted Category');
  });
});
