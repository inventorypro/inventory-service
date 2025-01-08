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
import fs from 'fs';
import path from 'path';
import app from '../../src/app';

let server;

beforeAll((done) => {
  server = app.listen(6000, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, '../../src/uploads'))) {
    fs.mkdirSync(path.join(__dirname, '../../src/uploads'));
  }
});

afterEach(() => {
  // Clean up the uploads directory after each test
  const files = fs.readdirSync(path.join(__dirname, '../../src/uploads'));
  for (const file of files) {
    fs.unlinkSync(path.join(__dirname, '../../src/uploads', file));
  }
});

describe('File Routes', () => {
  it('POST /files/upload - should upload a file', async () => {
    const response = await request(server)
      .post('/files/upload')
      .attach('file', Buffer.from('test file content'), 'testfile.txt');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
    expect(response.body.file).toHaveProperty('filename');
  });

  it('GET /files/download/:filename - should download a file', async () => {
    // First, upload a file
    const uploadResponse = await request(server)
      .post('/files/upload')
      .attach('file', Buffer.from('test file content'), 'testfile.txt');
    const filename = uploadResponse.body.file.filename;

    // Then, download the file
    const downloadResponse = await request(server).get(
      `/files/download/${filename}`
    );
    expect(downloadResponse.statusCode).toBe(200);
    expect(downloadResponse.headers['content-type']).toBe(
      'application/octet-stream'
    );
    expect(downloadResponse.text).toBe('test file content');
  });

  it('GET /files/download/:filename - should return 404 if file not found', async () => {
    const response = await request(server).get(
      '/files/download/nonexistentfile.txt'
    );
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('File not found');
  });
});
