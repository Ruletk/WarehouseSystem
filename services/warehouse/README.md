# Warehouse Service

This is a simple Node.js application that sets up an HTTP server to demonstrate a basic warehouse service.

## Project Structure

```
services/warehouse
├── src
│   └── app.js
├── package.json
├── Dockerfile
└── README.md
```

## Getting Started

To get started with this project, follow the steps below:

### Prerequisites

Make sure you have Node.js and npm installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd services/warehouse
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the application, run the following command:

```
npm start
```

The server will start and listen on port 8082. You can access it by navigating to `http://localhost:8082/` in your web browser. You should see the message "hello from warehouse service".

### Running with Docker

Or you can run the application using Docker. 

Just run the following command in the root directory of the project:

```
docker-compose up --build
```

The server will start and listen. You can access it by navigating to `http://localhost/api/v1/warehouse` in your web browser. You should see the message "hello from warehouse service".

### License

This project is licensed under the MIT License.
