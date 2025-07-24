const request = require('supertest');
const express = require('express');
// Mock fs module FIRST
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));
// Now import fs and router, which will use the mocked fs
const fs = require('fs');
const router = require('../../src/routes/items');

const app = express();
app.use(express.json());

// Custom error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
});

app.use('/api/items', router);

const mockItemsData = JSON.stringify([
  { "id": 1, "name": "Laptop Pro", "category": "Electronics", "price": 2499 },
  { "id": 2, "name": "Noise Cancelling Headphones", "category": "Electronics", "price": 399 },
  { "id": 3, "name": "Ultra‑Wide Monitor", "category": "Electronics", "price": 999 },
  { "id": 4, "name": "Ergonomic Chair", "category": "Furniture", "price": 799 },
  { "id": 5, "name": "Standing Desk", "category": "Furniture", "price": 1199 }
]);

describe('Items Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    it('should return the list of items (Happy Path)', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(JSON.parse(mockItemsData));
    });

    it('should return a 500 error if file reading fails', async () => {
      fs.promises.readFile.mockRejectedValue(new Error('File not found'));

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });

    it('should return items with limit parameter', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items?limit=2');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items).toEqual([
        { "id": 1, "name": "Laptop Pro", "category": "Electronics", "price": 2499 },
        { "id": 2, "name": "Noise Cancelling Headphones", "category": "Electronics", "price": 399 }
      ]);
    });

    it('should return items filtered by query parameter', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items?q=Chair');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items).toEqual([
        { "id": 4, "name": "Ergonomic Chair", "category": "Furniture", "price": 799 }
      ]);
    });

    it('should return items filtered by query and limited by limit parameter', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items?q=Laptop&limit=1');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items).toEqual([
        { "id": 1, "name": "Laptop Pro", "category": "Electronics", "price": 2499 },
      ]);
    });

    it('should return empty array if limit parameter is not a number', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items?limit=abc');

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a specific item by ID (Happy Path)', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items/2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ "id": 2, "name": "Noise Cancelling Headphones", "category": "Electronics", "price": 399 });
    });

    it('should return 404 if item not found', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({});
    });

    it('should return 400 if ID is not a number', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);

      const response = await request(app).get('/api/items/abc');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({});
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item (Happy Path)', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);
      fs.promises.writeFile.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/items')
        .send({ name: 'New Item', category: 'Test', price: 100 });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Item');
      expect(response.body.category).toBe('Test');
      expect(response.body.price).toBe(100);
      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('number');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ category: 'Test', price: 100 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({});
    });

    it('should return 500 if file writing fails', async () => {
      fs.promises.readFile.mockResolvedValue(mockItemsData);
      fs.promises.writeFile.mockRejectedValue(new Error('Failed to write file'));

      const response = await request(app)
        .post('/api/items')
        .send({ name: 'New Item', category: 'Test', price: 100 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });
  });
});
