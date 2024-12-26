# Auth Service

This is a simple Node.js application that sets up an HTTP server to demonstrate a basic authentication service.

## Project Structure

```
services/auth
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
   cd services/auth
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

The server will start and listen on port 8081. You can access it by navigating to `http://localhost:8081/` in your web browser. You should see the message "hello from auth service".

### Running with Docker

Or you can run the application using Docker. 

Just run the following command in the root directory of the project:

```
docker-compose up --build
```

The server will start and listen. You can access it by navigating to `http://localhost/api/v1/auth` in your web browser. You should see the message "hello from auth service".

### License

This project is licensed under the MIT License.