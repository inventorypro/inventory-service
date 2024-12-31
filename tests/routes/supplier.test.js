import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Supplier from '../../src/models/supplier';

let server;

// Sample mock data for Supplier model
const mockSupplier = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test Supplier',
  contactInfo: 'test@supplier.com',
  address: '123 Supplier St.'
};

beforeAll((done) => {
  server = app.listen(5000, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(async () => {
  // Insert mock supplier into the database
  await Supplier.create(mockSupplier);
});

afterEach(async () => {
  // Remove mock supplier from the database
  await Supplier.deleteMany({});
});

describe('Supplier Routes', () => {
  it('GET /suppliers - should return all suppliers', async () => {
    const response = await request(server).get('/suppliers');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /suppliers/:id - should return a supplier by ID', async () => {
    const response = await request(server).get(`/suppliers/${mockSupplier._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(mockSupplier.name);
    expect(response.body.contactInfo).toBe(mockSupplier.contactInfo);
    expect(response.body.address).toBe(mockSupplier.address);
  });

  it('POST /suppliers - should create a new supplier', async () => {
    const newSupplier = {
      name: 'New Supplier',
      contactInfo: 'new@supplier.com',
      address: '456 Supplier St.'
    };
    const response = await request(server).post('/suppliers').send(newSupplier);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newSupplier.name);
    expect(response.body.contactInfo).toBe(newSupplier.contactInfo);
    expect(response.body.address).toBe(newSupplier.address);
  });

  it('PUT /suppliers/:id - should update an existing supplier', async () => {
    const updatedSupplier = {
      name: 'Updated Supplier',
      contactInfo: 'updated@supplier.com',
      address: '789 Supplier St.'
    };
    const response = await request(server)
      .put(`/suppliers/${mockSupplier._id}`)
      .send(updatedSupplier);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedSupplier.name);
    expect(response.body.contactInfo).toBe(updatedSupplier.contactInfo);
    expect(response.body.address).toBe(updatedSupplier.address);
  });

  it('DELETE /suppliers/:id - should delete a supplier by ID', async () => {
    const response = await request(server).delete(`/suppliers/${mockSupplier._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Deleted Supplier');
  });
});
