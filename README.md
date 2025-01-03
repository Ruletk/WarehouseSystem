# Warehouse Management System

Readme version 0.0.1

## Table of contents

1. [Description](#description)
2. [Before you start](#before-you-start)
3. [Setup](#setup)
4. [Development commands](#development-commands)
5. [Git workflow](#git-workflow)
6. [Useful links](#useful-links)
7. [License](#license)


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


## Git workflow

To ensure smooth collaboration and maintain a clean and organized repository, the following Git workflow is implemented in this project:

___

### **Branching Strategy**
1. **Microservice branches**

    Each microservice has its own dedicated branch named after the service.

    Naming convention: `microservice/<service-name>`

    Example:
    - `microservice/auth`
    - `microservice/warehouse`
    - `microservice/order`
    - `microservice/notification`

2. **Feature branches**

    New features or changes to a specific microservice are developed in separate branches based on the microservice branch.

    Naming convention: `<type>/<service-name>/<change-description>`

    There are types of branches:
    - `feature`: For new features.
    - `bugfix`: For bug fixes.
    - `refactor`: For code refactoring.
    - `documentation`: For documentation changes.
    - `library`: For adding or modifying shared libraries.
    - `other`: For other changes that do not fit into any of the above categories.


    Example:
    - `feature/auth/add-login-endpoint`
    - `feature/warehouse/fix-inventory-bug`
    - `refactor/order/improve-request-bottleneck`

    Branches that not related to a specific microservice should ignore the `<service-name>` part.

    Example:
    - `feature/add-logging`
    - `bugfix/fix-logging-bug`


3. **Merging to the main branch**
    
    For development we have `development` branch. When the feature is ready, the feature branch is merged into the microservice branch. When all the features are ready, the microservice branch is merged into the `development` branch. When the development branch is stable, it is merged into the `master` branch.

    Master branch is the production branch. It should always contain the latest stable version of the application. Only pull requests are allowed to merge into the master branch.

    In development branch you can commit directly, but you need to notify the team about the changes.

4. **Git fetch and pull**

    Before starting work on a new feature, always fetch the latest changes from the remote repository and pull them into your local repository.

    ```sh
    git fetch
    git pull
    ```

    Better if you use `git fetch --all` and `git pull --all` to fetch and pull all branches.

5. **Commit messages guidelines**
    To maintain consistency and clarity in the commit history, follow this naming convention for commit messages:

    1. **feat**: For new features.

        New feature is a change that adds functionality to the application. Funtionality is a code that do something for the user and have logic in it.

        Example: `feat: add login endpoint`

    2. **fix**: For bug fixes.

        A bug fix is a change that makes a previously broken code work as intended. Typo fixes, error handling, and logic fixes are considered bug fixes.

        Critical bug fixes should be marked with `BREAKING CHANGE` in the commit message at the end.

        Example: `fix: resolve inventory bug`

    3. **docs**: For documentation changes.

        It includes changes to the README, comments, and documentation files.

        Example: `docs: update README.md`

    4. **style**: For code style changes.

        It includes formatting, missing semicolons, running linter, change linting rules, etc.

        Example: `style: format code`

    5. **refactor**: For code refactoring.

        It includes changes that neither fixes a bug nor adds a feature. Refactoring improves the code quality, readability, and maintainability.

        Example: `refactor: improve inventory service`

    6. **test**: For adding or modifying tests.

        It includes changes to the test files, adding new tests, and modifying existing tests.

        If it is a commit that fixes the test, it should be marked as `test+fix`, combined with `fix`.

        Example: `test: add unit tests for inventory service`

    7. **chore**: For changes to the build process or auxiliary tools.

        It includes changes to the build process, CI/CD pipeline, and other auxiliary tools.

        Updating dependencies should be marked as `chore`.

        Example: `chore: update dependencies`

    8. **other**: For other changes that do not fit into any of the above categories.

        Example: `other: update .gitignore`

    9. **BREAKING CHANGE**: For changes that break the existing code.

        It includes changes that require the user to modify their code to make it work with the latest version.

        Example: `feat: add login endpoint BREAKING CHANGE: change response format`

    All prefixes should be in **lowercase** and **followed by a colon and a space**. The commit message should start with a capital letter and be written in the present or past tense. Message should be clear and concise and end with a **period** (**.**, dot).

    Prefixes can be combined if the commit falls into multiple categories. For example, a commit that adds a new feature and fixes a bug can be prefixed with `feat+fix`.

    But it is better to split the commit into two separate commits, one for the feature and one for the bug fix.

## Useful links

### [Nx Documentation](https://nx.dev)
### [Express Documentation](https://expressjs.com/)
### [TypeORM Documentation](https://typeorm.io/)

## License

This project is licensed under the MIT License, which allows you to use, modify, and distribute the software freely as long as proper attribution is given. See the [LICENSE](LICENSE) file for details.
