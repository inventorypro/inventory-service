import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Category from '../../src/models/category';

let server;

// Sample mock data for Category model
const mockCategory = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Category',
  description: 'This is a test category'
};

beforeAll((done) => {
  server = app.listen(4000, done); // Specify a port here, e.g., 4000
});

afterAll((done) => {
  server.close(done);
});

beforeEach(async () => {
  // Insert mock category into the database
  await Category.create(mockCategory);
});

afterEach(async () => {
  // Remove mock category from the database
  await Category.deleteMany({});
});

describe('Category Routes', () => {
  it('GET /categories - should return all categories', async () => {
    const response = await request(server).get('/categories');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /categories/:categoryId - should return a category by ID', async () => {
    const response = await request(server).get(`/categories/${mockCategory._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockCategory.name);
    expect(response.body.description).toBe(mockCategory.description);
  });

  it('POST /categories - should create a new category', async () => {
    const newCategory = {
      name: 'New Category',
      description: 'This is a new category'
    };
    const response = await request(server).post('/categories').send(newCategory);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newCategory.name);
    expect(response.body.description).toBe(newCategory.description);
  });

  it('PUT /categories/:categoryId - should update an existing category', async () => {
    const updatedCategory = {
      name: 'Updated Category',
      description: 'This is an updated category'
    };
    const response = await request(server)
      .put(`/categories/${mockCategory._id}`)
      .send(updatedCategory);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedCategory.name);
    expect(response.body.description).toBe(updatedCategory.description);
  });

  it('DELETE /categories/:categoryId - should delete a category by ID', async () => {
    const response = await request(server).delete(`/categories/${mockCategory._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Deleted Category');
  });
});
