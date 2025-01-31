# Inventory Service

Inventory Service is a REST API for managing inventory items, categories, suppliers, and stock levels. It provides endpoints for CRUD operations on inventory items, categories, suppliers, and stock levels, as well as file upload and download functionality.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Docker](#docker)
- [Kubernetes Deployment](#kubernetes-deployment)
- [License](#license)

## Features

- CRUD operations for inventory items, categories, suppliers, and stock levels
- File upload and download functionality
- Swagger API documentation
- Unit tests with in-memory MongoDB
- Docker support
- Kubernetes deployment configuration

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/inventory-service.git
   cd inventory-service
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a .env file in the root directory and add the following environment variables:

   ```txt
   MONGO_URI=your_mongodb_uri
   LOG_LEVEL=debug
   ```

## Usage

1. Start the server:
   ```sh
   npm start
   ```
2. The server will be running on http://localhost:3000.

## API Documentation

1. To run unit tests, use the following command:
   ```sh
   npm test
   ```
2. The tests use an in-memory MongoDB instance to ensure isolation and speed.

## Docker

1. Build the Docker image:

   ```sh
   docker build -t yourusername/inventory-service:latest .
   ```

2. Run the Docker container:
   ```sh
   docker run -p 3000:3000 yourusername/inventory-service:latest
   ```

## Kubernetes Deployment

1. Apply the MongoDB setup:
   ```sh
   kubectl apply -f mongodb-setup/mongodb-pvc.yaml
   kubectl apply -f mongodb-setup/mongodb-deployment.yaml
   kubectl apply -f mongodb-setup/mongodb-service.yaml
   ```
2. Apply the inventory service deployment:
   ```sh
   kubectl apply -f deploy/pv.yaml
   kubectl apply -f deploy/pvc.yaml
   kubectl apply -f deploy/pod.yaml
   kubectl apply -f deploy/service.yaml
   ```

## License

This project is licensed under the ISC License.
