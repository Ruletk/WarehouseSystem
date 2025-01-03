# Warehouse Management System

Readme version 0.0.1

## Table of contents

1. [Description](#description)
2. [Before you start](#before-you-start)
3. [Setup](#setup)
4. [Development commands](#development-commands)
5. [Useful links](#useful-links)
6. [License](#license)


## Description
This is sample description. 

TODO: Add description.

## Before you start

Properly read this section before you start the development.

For development environment, you need to have [Node.js](https://nodejs.org/en/download/) installed. Use only 18.x version of Node.js!

If you using VSCode, you must install [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) for consistent code formatting.

I recommend to use [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) in VSCode for faster nx command execution.

For environment setup, you need to have [Docker](https://www.docker.com/products/docker-desktop) installed.


## Setup

Firstly, clone the repository:

```sh
git clone https://github.com/Ruletk/WarehouseSystem.git
```

Then, install the dependencies:

```sh
npm install
```

Initialize the environment:

```sh
docker-compose up
```
It can take some time to download the images and start the services, but only for the first time.


## Development commands

To list the available targets/projects, use: `npx nx projects`

To show application graph, use: `npx nx graph`

To run the dev server of the application, use: `npx nx serve *service-name*`

To build the application, use: `npx nx build *service-name*`

To generate a new application, use: `npx nx g @nx/express:app apps/*app-name*`

To generate a new library, use: `npx nx g @nx/node:lib *lib-name*`

To start the environment, use: `docker-compose up`. To stop the environment, use: `docker-compose down`. I don't recommend to use `-d` flag for `docker-compose up` command, because you will not see the logs of the services.

## Useful links

### [Nx Documentation](https://nx.dev)
### [Express Documentation](https://expressjs.com/)
### [TypeORM Documentation](https://typeorm.io/)

## License

This project is licensed under the MIT License, which allows you to use, modify, and distribute the software freely as long as proper attribution is given. See the [LICENSE](LICENSE) file for details.
